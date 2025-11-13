
// https://vitepress.dev/reference/site-config
import { defineConfig } from "vitepress";
import { withSidebar } from 'vitepress-sidebar';
import mathjax3 from 'markdown-it-mathjax3'

// Configure base path for deployment
// Change this to your deployment path, e.g., '/vite-press-ltf/' for GitHub Pages
const BASE_PATH = process.env.GITHUB_PAGES === 'true' ? '/vite-press-ltf/' : '/';
const vitePressConfigs = ({
  // Base path used when the site is deployed to a sub-path (GitHub Pages, etc.)
  base: BASE_PATH,
  title: "dreaming dreamer",
  description: "A VitePress Site",
  markdown: {
    lineNumbers: true, // 启用行号
    config: (md: { use: (arg0: any) => void; }) => {
      // 使用 markdown-it-mathjax3
      md.use(mathjax3);
      
      // 或者使用 markdown-it-katex
      // const katex = require('markdown-it-katex');
      // md.use(katex);
    }
  },
  themeConfig: {
    outline: {
      level: [2, 6],
      label: '本页目录'
    },
    search: {
      provider: "local",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});

export default defineConfig(
  withSidebar(vitePressConfigs, {
    /*
     * For detailed instructions, see the links below:
     * https://vitepress-sidebar.cdget.com/guide/options
     */
    //
    // ============ [ RESOLVING PATHS ] ============
    // documentRootPath: '/',
    // scanStartPath: null,
    // resolvePath: null,
    // basePath: null,
    // followSymlinks: false,
    //
    // ============ [ GROUPING ] ============
     collapsed: true,
     collapseDepth: 3,
    // rootGroupText: 'Contents',
    // rootGroupLink: 'https://github.com/jooy2',
    // rootGroupCollapsed: false,
    //
    // ============ [ GETTING MENU TITLE ] ============
    // useTitleFromFileHeading: true,
    // useTitleFromFrontmatter: true,
    // useFolderLinkFromIndexFile: false,
    // useFolderTitleFromIndexFile: false,
    // frontmatterTitleFieldName: 'title',
    //
    // ============ [ GETTING MENU LINK ] ============
    // useFolderLinkFromSameNameSubFile: false,
    // useFolderLinkFromIndexFile: false,
    // folderLinkNotIncludesFileName: false,
    //
    // ============ [ INCLUDE / EXCLUDE ] ============
    // excludeByGlobPattern: ['README.md', 'folder/'],
    // excludeFilesByFrontmatterFieldName: 'exclude',
    // includeDotFiles: false,
    // includeEmptyFolder: false,
    // includeRootIndexFile: false,
    // includeFolderIndexFile: false,
    //
    // ============ [ STYLING MENU TITLE ] ============
    // hyphenToSpace: true,
    // underscoreToSpace: true,
    // capitalizeFirst: false,
    // capitalizeEachWords: false,
    // keepMarkdownSyntaxFromTitle: false,
    // removePrefixAfterOrdering: false,
    // prefixSeparator: '.',
    //
    // ============ [ SORTING ] ============
    // manualSortFileNameByPriority: ['first.md', 'second', 'third.md'],
    // sortFolderTo: null,
    // sortMenusByName: false,
    // sortMenusByFileDatePrefix: false,
    // sortMenusByFrontmatterOrder: false,
    // frontmatterOrderDefaultValue: 0,
    // sortMenusByFrontmatterDate: false,
    // sortMenusOrderByDescending: false,
    // sortMenusOrderNumericallyFromTitle: false,
    // sortMenusOrderNumericallyFromLink: false,
    //
    // ============ [ MISC ] ============
    // debugPrint: false,
  })
);
