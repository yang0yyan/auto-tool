const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.js'], // 你的源码入口
  outfile: 'dist/bundle.min.js', // 打包输出的文件
  bundle: true,                  // 打包所有依赖（虽然你目前没引入外部库，但这是好习惯）
  minify: true,                  // 开启代码压缩和混淆
  sourcemap: false,              // 不生成源码映射（发布时通常不需要）
  target: ['es2015'],            // 兼容到 ES2015 语法（现代浏览器都支持）
}).then(() => {
  console.log('✅ 打包成功！文件已生成在 dist/bundle.min.js');
}).catch(() => process.exit(1));