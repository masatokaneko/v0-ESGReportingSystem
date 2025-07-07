import { pgTable, serial, text, timestamp, numeric, integer, jsonb } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  region: text('region').notNull(),
  country: text('country').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const emissionFactors = pgTable('emission_factors', {
  id: serial('id').primaryKey(),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
  unit: text('unit').notNull(),
  factor: numeric('factor', { precision: 10, scale: 6 }).notNull(),
  source: text('source').notNull(),
  year: integer('year').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const esgEntries = pgTable('esg_entries', {
  id: serial('id').primaryKey(),
  locationId: integer('location_id').notNull().references(() => locations.id),
  date: timestamp('date', { withTimezone: true }).notNull(),
  type: text('type').notNull(),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
  value: numeric('value', { precision: 15, scale: 2 }).notNull(),
  unit: text('unit').notNull(),
  emissionFactorId: integer('emission_factor_id').references(() => emissionFactors.id),
  calculatedEmissions: numeric('calculated_emissions', { precision: 15, scale: 2 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Location = typeof locations.$inferSelect
export type NewLocation = typeof locations.$inferInsert
export type EmissionFactor = typeof emissionFactors.$inferSelect
export type NewEmissionFactor = typeof emissionFactors.$inferInsert
export type ESGEntry = typeof esgEntries.$inferSelect
export type NewESGEntry = typeof esgEntries.$inferInsert