/**
 * Contrib-jshint     —— javascript语法错误检查；
 * Contrib-watch      —— 实时监控文件变化、调用相应的任务重新执行；
 * Contrib-clean      —— 清空文件、文件夹；
 * Contrib-uglify     —— 压缩javascript代码
 * Contrib-copy       —— 复制文件、文件夹
 * Contrib-concat     —— 合并多个文件的代码到一个文件中
 * karma              —— 前端自动化测试工具
 */

module.exports = function(grunt) {

    // 构建任务配置
    grunt.initConfig({
        // //读取 package.json 的内容，形成 json 数据
        pkg: grunt.file.readJSON('package.json'),
        /**
         * watch —— 可以监控特定的文件，在添加文件、修改文件、或者删除文件的时候自动执行自定义的任务，比如 livereload 等等。
         *          指定任务，该任务下有 jade 与 js 两个目标，实时监控项目
         */
        watch: {
            jade: {
                // 传递所需监听的视图文件
                files: ['views/**'],
                // 指定覆盖内置属性的默认值,目标（target）级的options将会覆盖任务级的options
                options: {
                    // 文件出现改动时重新启动服务
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },

        /**
         * nodemon ——自动重启项目工程，node 有一个 npm 模块 supervisior 也是用来监控进程的，不过除了 
         *           supervisior 外，还有很多其他的工具，从 github 的评分上看，比较热门的有 
         *           forever，nodemon，node-dev，具体这些工具的区别可以参考这篇文章 
         *           Comparison: Tools to Automate Restarting Node.js Server After Code Changes ，
         *           开发环境还是用 nodemon，因为配置比较方便，文档也很清晰。
         * 
         *  自动重启项目工程插件
         */
        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3100,
                    },
                    cwd: __dirname
                }
            }
        },

        /**
         * grunt-concurrent：Grunt任务，并发运行缓慢的任务就像Coffee和Sass， 可能显著改善您的构建时间。
         *                  如果要一次运行nodmon和watch，grunt-concurrent这个插件是很有用的。 
         */
        concurrent: {
            target: {
                tasks: ['nodemon', 'watch'],
                options: {
                    // 并发输出日志记录
                    logConcurrentOutput: true
                }
            }
        }
    });

    /**
     * 加载插件
     * - Task: 指定一个包含可加载的任务和“额外”文件的目录。
     *          还可以调用 grunt.loadTasks(…)
     * - npm: 在通过npm安装的插件中检查可加载的任何以及额外文件。
     *          还可以调用 grunt.loadNpmTasks(…)
     */
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    //配置参数
    grunt.option('force', true);
    // 定义了一个 ‘default’ 任务，如果运行Grunt时没有指定任何任务，它将自动执行concurrent任务。
    grunt.registerTask('default', ['concurrent:target']);
};