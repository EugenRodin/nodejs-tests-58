console.log('#58. JavaScript homework example file')

/*
 *
 * #1
 *
 * Технічне завдання для розробки функції "compressFile"
 *
 * Задача:
 * Розробити асинхронну функцію, що використовує алгоритм Gzip для компресії заданого файлу.
 * Функція має генерувати унікальне ім'я для компресованого файлу, якщо файл з таким іменем вже існує,
 * та забезпечувати високий рівень надійності та безпеки процесу компресії.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *    - `filePath`: Шлях до файлу, який потрібно компресувати.
 *
 * 2. Вихідні дані:
 *    - Функція повертає шлях до компресованого файлу як рядок.
 *
 * 3. Унікальність:
 *    - Перевірка наявності існуючих файлів з таким самим іменем і створення унікального імені файлу
 *      шляхом додавання номера до існуючого імені, якщо необхідно.
 *
 * 4. Обробка помилок:
 *    - Функція має ідентифікувати та коректно обробляти помилки читання, запису та доступу до файлів.
 *    - В разі помилок, функція має повертати відповідні повідомлення про помилку або коди помилок,
 *      що дозволяють користувачеві або іншим частинам програми адекватно реагувати на такі ситуації.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи асинхронні функції, стрімове API Node.js, та ESM
 *   для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб її можна було експортувати та використовувати в інших частинах програми
 *   або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи, виключень, які можуть бути сгенеровані,
 *   та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою JEST.
 *
 */

import { promises as fs } from 'fs'
import { createGzip } from 'zlib'
import { pipeline } from 'stream'
import { basename, dirname, join, extname } from 'path'
import { promisify } from 'util'

const pipe = promisify(pipeline)

async function compressFile(filePath) {
  try {
    // Перевірка існування файлу
    await fs.access(filePath)

    const fileDir = dirname(filePath)
    const fileExt = extname(filePath)
    const fileName = basename(filePath, fileExt)
    let compressedFilePath = join(fileDir, `${fileName}.gz`)

    // Генерація унікального імені для компресованого файлу
    let counter = 1
    while (true) {
      try {
        await fs.access(compressedFilePath)
        compressedFilePath = join(fileDir, `${fileName}_${counter}.gz`)
        counter++
      } catch {
        break
      }
    }

    // Компресія файлу
    const gzip = createGzip()
    const source = fs.createReadStream(filePath)
    const destination = fs.createWriteStream(compressedFilePath)

    await pipe(source, gzip, destination)

    return compressedFilePath
  } catch (error) {
    console.error('Error during file compression:', error)
    throw new Error('File compression failed')
  }
}

/*
 *
 * #2
 *
 * Технічне завдання для розробки функції "decompressFile"
 *
 * Задача:
 * Розробити асинхронну функцію, яка використовує алгоритм Gzip для розпакування заданого компресованого файлу у вказане місце збереження. Функція має генерувати унікальне ім'я для розпакованого файлу, якщо файл з таким іменем вже існує, та забезпечувати високий рівень надійності та безпеки процесу розпакування.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - `compressedFilePath`: Шлях до компресованого файлу, який потрібно розпакувати.
 *  - `destinationFilePath`: Шлях, де буде збережено розпакований файл.
 *
 * 2. Вихідні дані:
 *  - Функція повертає шлях до розпакованого файлу як рядок.
 *
 * 3. Унікальність:
 *  - Перевірка наявності існуючих файлів з таким самим іменем і створення унікального імені файлу шляхом додавання номера до існуючого імені, якщо необхідно.
 *
 * 4. Обробка помилок:
 *  - Функція має ідентифікувати та коректно обробляти помилки читання, запису та доступу до файлів.
 *  - В разі помилок, функція має повертати відповідні повідомлення про помилку або коди помилок,
 *    що дозволяють користувачеві або іншим частинам програми адекватно реагувати на такі ситуації.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи асинхронні функції, стрімове API Node.js, та ESM для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб її можна було експортувати та використовувати в інших частинах програми або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи, виключень, які можуть бути сгенеровані, та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою JEST.
 *
 */

import { promises as fs } from 'fs'
import { createGunzip } from 'zlib'
import { pipeline } from 'stream'
import { basename, dirname, join, extname } from 'path'
import { promisify } from 'util'

const pipe = promisify(pipeline)

async function decompressFile(compressedFilePath, destinationFilePath) {
  try {
    // Перевірка існування компресованого файлу
    await fs.access(compressedFilePath)

    const fileDir = dirname(destinationFilePath)
    const fileExt = extname(destinationFilePath)
    const fileName = basename(destinationFilePath, fileExt)
    let decompressedFilePath = join(fileDir, `${fileName}${fileExt}`)

    // Генерація унікального імені для розпакованого файлу
    let counter = 1
    while (true) {
      try {
        await fs.access(decompressedFilePath)
        decompressedFilePath = join(fileDir, `${fileName}_${counter}${fileExt}`)
        counter++
      } catch {
        break
      }
    }

    // Розпакування файлу
    const gunzip = createGunzip()
    const source = fs.createReadStream(compressedFilePath)
    const destination = fs.createWriteStream(decompressedFilePath)

    await pipe(source, gunzip, destination)

    return decompressedFilePath
  } catch (error) {
    console.error('Error during file decompression:', error)
    throw new Error('File decompression failed')
  }
}

! Перевірка роботи функцій стиснення та розпакування файлів
async function performCompressionAndDecompression() {
  try {
    const compressedResult = await compressFile('./files/source.txt')
    console.log(compressedResult)
    const decompressedResult = await decompressFile(compressedResult, './files/source_decompressed.txt')
    console.log(decompressedResult)
  } catch (error) {
    console.error('Error during compression or decompression:', error)
  }
}
performCompressionAndDecompression()

export { compressFile, decompressFile }
