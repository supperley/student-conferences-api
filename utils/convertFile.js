import { spawn } from 'child_process';

export const convertFile = (srcFile, destDir, type) => {
  return new Promise((resolve, reject) => {
    var soffice = spawn('soffice', [
      '--headless',
      '--nologo',
      '--nolockcheck',
      '--nodefault',
      '--norestore',
      '--convert-to',
      type,
      srcFile,
      '--outdir',
      destDir,
    ]);

    var stdoutBuffer = '';

    soffice.stdout.on('data', function (data) {
      stdoutBuffer += data.toString();
    });

    soffice.stderr.on('data', function (data) {
      stdoutBuffer += data.toString();
    });

    soffice.on('exit', function (code) {
      if (code === 0) {
        return resolve(
          'LibreOffice converted successfully with exit code ' +
            code +
            ' and message: ' +
            stdoutBuffer,
        );
      } else {
        return reject('LibreOffice died with exit code ' + code + ' and message: ' + stdoutBuffer);
      }
    });
  });
};
