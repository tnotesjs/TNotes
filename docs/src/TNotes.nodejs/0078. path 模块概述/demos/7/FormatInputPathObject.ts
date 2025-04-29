interface FormatInputPathObject {
  /**
   * The root of the path such as '/' or 'c:\'
   */
  root?: string | undefined
  /**
   * The full directory path such as '/home/user/dir' or 'c:\path\dir'
   */
  dir?: string | undefined
  /**
   * The file name including extension (if any) such as 'index.html'
   */
  base?: string | undefined
  /**
   * The file extension (if any) such as '.html'
   */
  ext?: string | undefined
  /**
   * The file name without extension (if any) such as 'index'
   */
  name?: string | undefined
}
