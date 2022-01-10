export default async ({ store, _$axios }, inject) => {
  const environment = process.env.NODE_ENV
  const envSet = require(`~/env.${environment}.js`)
}