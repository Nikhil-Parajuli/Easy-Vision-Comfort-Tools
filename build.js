import * as esbuild from 'esbuild';
import { mkdir, copyFile, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function build() {
  // Ensure dist directory exists
  await mkdir('dist', { recursive: true });
  await mkdir('dist/js', { recursive: true });
  await mkdir('dist/css', { recursive: true });

  // Build JS files
  await esbuild.build({
    entryPoints: [
      'src/js/popup.js',
      'src/js/content.js',
      'src/js/background.js',
      'src/js/filters.js',
      'src/js/storage.js'
    ],
    bundle: true,
    format: 'esm',
    outdir: 'dist/js',
    minify: true,
    sourcemap: true,
    target: ['chrome90'],
  });

  // Copy static files
  const staticFiles = [
    ['src/popup.html', 'dist/popup.html'],
    ['manifest.json', 'dist/manifest.json'],
    ['content.css', 'dist/content.css'],
    ['popup.css', 'dist/css/popup.css']
  ];

  for (const [src, dest] of staticFiles) {
    await copyFile(src, dest);
  }

  console.log('Build completed successfully!');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});