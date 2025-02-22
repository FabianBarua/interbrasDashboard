import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
export * from './schemaAuth';

export const Languages = sqliteTable("languages", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
});

// ------------------------------- Category -------------------------------

export const Category = sqliteTable("category", {
  id: text().primaryKey().notNull(),
});

export const CategoryTranslation = sqliteTable("category_translation", {
  id: int().primaryKey({ autoIncrement: true }).notNull(),
  category_id: text().references(() => Category.id, {onDelete: 'cascade', onUpdate:'cascade'}).notNull(),
  name: text().notNull(),
  description: text().notNull(),
  shortDescription: text().notNull(),
  lang: text().notNull().references(() => Languages.id, {onDelete: 'cascade', onUpdate:'cascade'}).notNull(),
});

// ------------------------------- Product -------------------------------

export const Product = sqliteTable("product", 
  {
  id: text().primaryKey().notNull(),
  category_id: text().references(() => Category.id, {onDelete: 'cascade', onUpdate:'cascade'}).notNull(),
});

export const ProductTranslation = sqliteTable("product_translation", {
  id: int().primaryKey({ autoIncrement: true }).notNull(),
  product_id: text().references(() => Product.id, {onDelete: 'cascade', onUpdate:'cascade'}).notNull(),
  name: text().notNull(),
  review: text().notNull(),
  included: text(),
  specs: text().notNull(),
  lang: text().notNull().references(() => Languages.id, {onDelete: 'cascade', onUpdate:'cascade'}).notNull(),
});

// ------------------------------- Color -------------------------------

// remove column color
export const Color = sqliteTable("color", {
  id: text().primaryKey().notNull(),
  color: text()
});

// remove key column
export const ColorTranslation = sqliteTable("color_translation", {
  id: int().primaryKey({ autoIncrement: true }).notNull(),
  color_id: text().notNull().references(() => Color.id, {onDelete: 'cascade', onUpdate:'cascade'}).notNull(),
  key: text(),
  name: text().notNull(),
  lang: text().notNull().references(() => Languages.id, {onDelete: 'cascade', onUpdate:'cascade'}).notNull(),
});

// ------------------------------- Volt -------------------------------

export const Volt = sqliteTable("volt", {
  id: int().primaryKey({ autoIncrement: true }).notNull(),
  name: text()
});

// ------------------------------- Variant -------------------------------

export const Variant = sqliteTable("variant", {
  id: int().primaryKey({ autoIncrement: true }).notNull(),
  product_id: text().references(() => Product.id).notNull(),
  volt_id: int().references(() => Volt.id).notNull(),
  color_id: text().references(() => Color.id, {onDelete: 'set null'}),
  catalog_id: int().references(() => Catalog.id).notNull(),
});

// ------------------------------- Catalog -------------------------------

export const Catalog = sqliteTable("catalog", {
  id: int().primaryKey().notNull(),
  name: text().notNull(),
  price: real().notNull(),
  status_id : int().references(() => Status.id, {onDelete: 'set null', onUpdate:'cascade'}),
  productPerBox: int().notNull(),
  show: int({mode: 'boolean'}).default(true).notNull().notNull(),
} );

// ------------------------------- Status -------------------------------

export const Status = sqliteTable("status", {
  id: int().primaryKey({ autoIncrement: true}).notNull(),
  name: text().notNull()
})

export const StatusTranslation = sqliteTable("status_translation", {
  id: int().primaryKey({ autoIncrement: true }).notNull(),
  status_id: int().references(() => Status.id, {onDelete: 'cascade', onUpdate:'cascade'}).notNull(),
  name: text().notNull(),
  lang: text().notNull().references(() => Languages.id, {onDelete: 'cascade', onUpdate:'cascade'}).notNull(),
});

// ------------------------------- Photo -------------------------------

export const Photo = sqliteTable("photo", {
  id: int().primaryKey({ autoIncrement: true }).notNull(),
  variant_id: int().references(() => Variant.id, {onDelete: 'cascade', onUpdate:'cascade'}).notNull(),
  url: text().notNull(),
  order: int().notNull(),
});

// ------------------------------- Internationalization -------------------------------

export const Internationalization = sqliteTable("internationalization", {
  id: int().primaryKey({ autoIncrement: true }).notNull(),
  key : text().notNull(),
  value: text(),
  lang: text().notNull().references(() => Languages.id, {onDelete: "set null", onUpdate:'cascade'}).notNull(),
} );

