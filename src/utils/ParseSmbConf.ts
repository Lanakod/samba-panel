import { IShare } from '@/interfaces';
import * as fs from 'fs';

interface Section {
  name: string;
  lines: string[];
}

export function parseFile(filePath: string): Section[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  const sections: Section[] = [];
  let currentSection: Section | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    const sectionMatch = /^\[([^\]]+)\]$/.exec(trimmed);
    if (sectionMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { name: sectionMatch[1], lines: [] };
    } else if (currentSection) {
      currentSection.lines.push(line);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

export function getSection(sections: Section[], sectionName: string): Section | null {
  return sections.find(sec => sec.name.toLowerCase() === sectionName.toLowerCase()) || null;
}

export function getGlobalSection(sections: Section[]): Section | null {
  return sections.find(sec => sec.name.toLowerCase() === 'global') || null;
}

// Маппинг ключей из smb.conf к camelCase свойствам IShare
const keyMap: { [key: string]: keyof IShare } = {
  path: 'path',
  comment: 'comment',
  'read only': 'readOnly',
  'create mask': 'createMask',
  'directory mask': 'directoryMask',
  browsable: 'browsable',
  'guest ok': 'guestOk'
};

export function parseSection(section: Section): IShare | null {
  if (section.name.toLowerCase() === 'global') {
    return null; // Игнорируем глобальную секцию тут
  }

  const result: Partial<IShare> = { name: section.name };

  for (const line of section.lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const keyValueMatch = /^([^=]+)=(.*)$/.exec(trimmed);
    if (!keyValueMatch) continue;

    const key = keyValueMatch[1].trim().toLowerCase();
    const value = keyValueMatch[2].trim();

    const mappedKey = keyMap[key];
    if (mappedKey) {
      if (mappedKey === 'readOnly' || mappedKey === 'browsable' || mappedKey === 'guestOk') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any)[mappedKey] = value.toLowerCase() === 'yes';
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any)[mappedKey] = value;
      }
    }
  }

  return result as IShare;
}

export function parseGlobalSection(section: Section): Record<string, string> {
  if (section.name.toLowerCase() !== 'global') {
    throw new Error('parseGlobalSection: секция не является [global]');
  }

  const result: Record<string, string> = {};

  for (const line of section.lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const keyValueMatch = /^([^=]+)=(.*)$/.exec(trimmed);
    if (!keyValueMatch) continue;

    const key = keyValueMatch[1].trim();
    const value = keyValueMatch[2].trim();

    result[key] = value;
  }

  return result;
}

// Пример: парсинг всего файла сразу в IShare[]
export function parseSmbConf(filePath: string): IShare[] {
  const sections = parseFile(filePath);
  return sections
    .filter(sec => sec.name.toLowerCase() !== 'global')
    .map(parseSection)
    .filter((s): s is IShare => s !== null);
}

// --- Your existing functions below ---

// Удаление секции по имени
export function removeSection(sections: Section[], sectionName: string): Section[] {
  return sections.filter(sec => sec.name.toLowerCase() !== sectionName.toLowerCase());
}

export function updateSection(
  sections: Section[],
  sectionName: string,
  updates: Record<string, string>
): Section[] {
  return sections.map(section => {
    if (section.name.toLowerCase() === sectionName.toLowerCase()) {
      // Filter and update lines
      const updatedLines = section.lines
        .map(line => {
          const trimmed = line.trim();
          const keyValueMatch = /^([^=]+)=(.*)$/.exec(trimmed);
          if (keyValueMatch) {
            const key = keyValueMatch[1].trim().toLowerCase();

            // Find update key matching this line (case-insensitive)
            const updateKey = Object.keys(updates).find(k => k.toLowerCase() === key);

            if (updateKey) {
              const newValue = updates[updateKey];

              // If key is comment and new value is empty => remove this line (return null)
              if (key === 'comment' && newValue.trim() === '') {
                return null; // mark line for removal
              }

              const padding = line.slice(0, line.indexOf(trimmed));
              return `${padding}${key} = ${newValue}`;
            }
          }
          return line;
        })
        .filter((line): line is string => line !== null); // remove lines marked as null

      // Add new params if they don't exist and are not empty comment
      for (const key in updates) {
        const keyLower = key.toLowerCase();

        // Skip adding empty comment
        if (keyLower === 'comment' && updates[key].trim() === '') {
          continue;
        }

        const exists = updatedLines.some(line => {
          const trimmed = line.trim();
          const keyValueMatch = /^([^=]+)=(.*)$/.exec(trimmed);
          return keyValueMatch && keyValueMatch[1].trim().toLowerCase() === keyLower;
        });

        if (!exists) {
          const padding = section.lines.length > 0 ? section.lines[0].match(/^\s*/)?.[0] || '   ' : '   ';
          updatedLines.push(`${padding}${key} = ${updates[key]}`);
        }
      }

      return { ...section, lines: updatedLines };
    }
    return section;
  });
}



// Сохранение изменений в файл
export function saveToFile(sections: Section[], filePath: string): void {
  let output = '';

  for (const section of sections) {
    output += `[${section.name}]\n`;
    for (const line of section.lines) {
      output += `${line}\n`;
    }
    output += '\n';
  }

  fs.writeFileSync(filePath, output.trimEnd(), 'utf-8');
}

export function createSection(
  sections: Section[],
  sectionName: string,
  params: Record<string, string>
): Section[] {
  // Проверяем, существует ли уже секция с таким именем
  const exists = sections.some(sec => sec.name.toLowerCase() === sectionName.toLowerCase());
  if (exists) {
    throw Error(`Секция [${sectionName}] уже существует. Создание отменено.`)
  }

  // Формируем строки параметров с отступом
  const lines = Object.entries(params).map(([key, value]) => {
    return `   ${key} = ${value}`;
  });

  // Добавляем новую секцию
  return [...sections, { name: sectionName, lines }];
}

export function renameSection(
  sections: Section[],
  oldName: string,
  newName: string
): Section[] {
  const oldNameLower = oldName.toLowerCase();
  const newNameLower = newName.toLowerCase();

  // Проверяем, существует ли секция с новым именем
  if (sections.some(sec => sec.name.toLowerCase() === newNameLower)) {
    console.warn(`Секция [${newName}] уже существует. Переименование отменено.`);
    return sections;
  }

  // Ищем секцию с нужным именем
  const sectionIndex = sections.findIndex(sec => sec.name.toLowerCase() === oldNameLower);
  if (sectionIndex === -1) {
    console.warn(`Секция [${oldName}] не найдена. Переименование отменено.`);
    return sections;
  }

  // Обновляем имя секции
  const updatedSections = [...sections];
  updatedSections[sectionIndex] = {
    ...updatedSections[sectionIndex],
    name: newName
  };

  return updatedSections;
}
