module.exports = {
    plugins: [
        [
          'module-resolver',
          {
            cwd: 'babelrc',
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
              client: './client',
            },
          },
        ],
      ]
  };