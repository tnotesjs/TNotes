function printPlatform() {
  // console.log(process.platform)
  if (process.platform === 'linux') console.log('当前使用的操作系统是 Linux')
  else if (process.platform === 'darwin') console.log('当前使用的操作系统是 MacOS')
  else if (process.platform === 'win32') console.log('当前使用的操作系统是 Windows')
  else console.log('当前使用的操作系统是未知')
}
printPlatform()