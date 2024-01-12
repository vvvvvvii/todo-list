module.exports = {
  title: 'Style Guide',
  defaultExample: true,
  sections: [
    {
      name: 'App',
      components: 'src/App.vue',
      sectionDepth: 0
    },
    {
      name: 'Components',
      components: 'src/components/**/[A-Z]*.vue',
      sectionDepth: 1
    }
  ],
  exampleMode: 'collapse',
  usageMode: 'expand',
  tocMode: 'collapse',
  copyCodeButton: true,
  pagePerSection: true,
  simpleEditor: true
}
