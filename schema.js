const fetch = require(`make-fetch-happen`);
const parse = require(`node-html-parser`).parse;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} = require(`graphql`);

const fetchOptions = {
  headers: {
    'user-agent': `Mozilla/5.0`
  }
};

const ProductType = new GraphQLObjectType({
  name: `Product`,
  description: `...`,

  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: (html) =>
        html.childNodes[0].childNodes[1].childNodes[11].childNodes[0].rawText
    }
  })
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: `Query`,
    description: `...`,

    fields: () => ({
      product: {
        type: ProductType,
        args: {
          id: {type: GraphQLString}
        },
        resolve: (root, args) => fetch(
            `https://www.phoenixcontact.com/online/portal/us/?uri=pxc-oc-itemdetail:pid=${args.id}&library=ruru&pcck=P-21-01-05&tab=5&selectedCategory=ALL`,
            fetchOptions
        )
          .then((response) => response.text())
          .then(parse)
          .catch((err) => console.log(err))
      }
    })
  })
});
