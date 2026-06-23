import fs from 'fs';
import path from 'path';

const base64Png =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';

const outputPath = path.join(process.cwd(), 'backend/tests/fixtures/test-image.png');

fs.writeFileSync(outputPath, Buffer.from(base64Png, 'base64'));

console.log(`Test image created at: ${outputPath}`);
