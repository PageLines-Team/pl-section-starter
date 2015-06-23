module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var pkg = grunt.file.readJSON('package.json');

		var slug = process.cwd().substr(process.cwd().lastIndexOf('/') + 1);
		var remote = 'git@github.com:PageLines-Team/' + slug + '.git'


    grunt.initConfig({
      pkg: pkg,

      clean: [ 'ui/js/*', 'dist', 'src' ],
      
      watch: {
				less: {
					// what files/folder we watching?
					files: [ 'ui/less/*.less' ],
          // tasks to run in order when something changes
          tasks: ['less'],
          options: {
              nospawn: true,
          }
        }, 
        js: {
          files: ['ui/scripts/*'], 
          tasks: ['concat'], 
          options: {
              nospawn: true,
          }
        }
      },
      less: {
				compileMain: {
					src:   'ui/less/build.less',
					dest: 'ui/css/style.css',
					options: {
						strictMath: true,
						sourceMap: false                }
					}
			},
      wp_readme_to_markdown: {
          your_target: {
              files: {
                'README.md': 'readme.txt'
              },
          },
        },

      concat: {
        options: {
          stripBanners: true,
          sourceMap:    false,
          separator:    '\n\n /* -------------------- */ \n\n',
        },
        common: {
          src: ['ui/scripts/*.js'],
          dest: 'ui/js/connect.js',
        },
        codeMirror: {
            src: ['ui/plugins/codemirror/*.js', '!ui/plugins/codemirror/pl.codemirror.js'],
            dest: 'ui/plugins/codemirror/pl.codemirror.js',
        },
      },
			
			buildcontrol: {
			    options: {
			      dir: 'dist',
			      commit: true,
			      push: true,
			      message:  grunt.option('message') + ' [Built from commit "%sourceCommit%"]'
			    },
			    remote: {
			      options: {
			        remote: remote,
			        branch: 'build'
			      }
			    }
			  },
				copy: {
				    build: {
				      files: [
				        // includes files within path
				        {
				          expand:   true,
				          src:      [ '**', pkg.copyIgnores ],
				          dest:     'dist/',
				          filter:   'isFile'
				        }
				      ]
				    }
				  }
    });

    grunt.registerTask( 'default', 	[ 'clean', 'less', 'concat', 'wp_readme_to_markdown', 'watch'] );
		
		grunt.registerTask( 'build', 		[ 'clean', 'less', 'concat', 'wp_readme_to_markdown',  'copy:build', 'buildcontrol'] );

    
}