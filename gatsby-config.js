module.exports = {
  siteMetadata: {
    title: "Fred Choi",
  },
  plugins: [
    "gatsby-plugin-typescript",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src`,
      },
    },
    "gatsby-transformer-javascript-frontmatter",
  ],
};
