const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Função para procurar recursivamente arquivos com um determinado sufixo
function findTestFiles(dir, suffix) {
  let results: any[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(findTestFiles(file, suffix));
    } else if (file.endsWith(suffix)) {
      results.push(file);
    }
  });
  return results;
}

// Encontrar todos os arquivos .test.js no diretório src
const testFiles = findTestFiles('src', '.test.ts');

if (testFiles.length === 0) {
  console.log('No test files found.');
  process.exit(1);
}

try {
  // Executar cada arquivo de teste com o runner nativo do Node.js
  testFiles.forEach((file) => {
    execSync(`node --test ${file}`, { stdio: 'inherit' });
  });
} catch (err) {
  console.error('Test execution failed', err);
  process.exit(1);
}
