import { copyFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function postBuild() {
  const distDir = 'dist';
  
  // Create necessary directories
  await mkdir(join(distDir, 'js'), { recursive: true });
  await mkdir(join(distDir, 'css'), { recursive: true });
  await mkdir(join(distDir, 'icons'), { recursive: true });

  // Copy manifest
  await copyFile('manifest.json', join(distDir, 'manifest.json'));

  // Copy icons
  const icons = ['icon16.png', 'icon48.png', 'icon128.png'];
  for (const icon of icons) {
    await copyFile(
      join('icons', icon),
      join(distDir, 'icons', icon)
    );
  }

  console.log('Post-build process completed successfully!');
}

postBuild().catch(err => {
  console.error('Post-build process failed:', err);
  process.exit(1);
});