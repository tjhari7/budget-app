import { v4 as uuidv4 } from 'uuid';
import { setDate, startOfMonth } from 'date-fns';
import type { Category, Transaction, BudgetType } from './types';

// Create a date within the current month at the given day (1-based), midday to avoid DST edge cases
function monthDay(day: number): string {
  const clampedDay = Math.min(day, new Date().getDate());
  const d = setDate(startOfMonth(new Date()), clampedDay);
  d.setHours(10, 0, 0, 0); // 10am — well within the day regardless of timezone
  return d.toISOString();
}

function makeTxn(categoryId: string, tag: BudgetType, amount: number, note: string, day: number): Transaction {
  return {
    id: uuidv4(),
    categoryId,
    amount,
    note,
    date: monthDay(day),
    tag,
  };
}

function makeCategory(
  name: string,
  type: BudgetType,
  icon: string,
  color: string,
  monthlyLimit: number,
  transactions: Transaction[]
): Category {
  return {
    id: uuidv4(),
    name,
    type,
    icon,
    color,
    monthlyLimit,
    transactions,
    createdAt: monthDay(1),
  };
}

export function generateSeedData(): Category[] {
  const rentId = uuidv4();
  const rent = makeCategory('Rent', 'need', '🏠', '#3b82f6', 1800, [
    makeTxn(rentId, 'need', 1800, 'Monthly rent payment', 1),
  ]);
  rent.id = rentId;
  rent.transactions.forEach(t => { t.categoryId = rentId; });

  const utilId = uuidv4();
  const utilities = makeCategory('Utilities', 'need', '💡', '#f59e0b', 200, [
    makeTxn(utilId, 'need', 85, 'Electric bill', 2),
    makeTxn(utilId, 'need', 40, 'Water bill', 3),
    makeTxn(utilId, 'need', 20, 'Internet', 5),
  ]);
  utilities.id = utilId;
  utilities.transactions.forEach(t => { t.categoryId = utilId; });

  const grocId = uuidv4();
  const groceries = makeCategory('Groceries', 'need', '🛒', '#22c55e', 400, [
    makeTxn(grocId, 'need', 120, 'Weekly groceries', 2),
    makeTxn(grocId, 'need', 95, "Trader Joe's run", 5),
    makeTxn(grocId, 'need', 65, 'Whole Foods', 7),
    makeTxn(grocId, 'need', 40, 'Corner store', 9),
  ]);
  groceries.id = grocId;
  groceries.transactions.forEach(t => { t.categoryId = grocId; });

  const healthId = uuidv4();
  const health = makeCategory('Health', 'need', '🏥', '#ec4899', 150, [
    makeTxn(healthId, 'need', 50, 'Doctor co-pay', 3),
    makeTxn(healthId, 'need', 25, 'Prescription', 6),
    makeTxn(healthId, 'need', 15, 'Vitamins', 8),
  ]);
  health.id = healthId;
  health.transactions.forEach(t => { t.categoryId = healthId; });

  const transId = uuidv4();
  const transport = makeCategory('Transport', 'need', '🚗', '#ef4444', 250, [
    makeTxn(transId, 'need', 120, 'Monthly transit pass', 1),
    makeTxn(transId, 'need', 75, 'Uber rides', 4),
    makeTxn(transId, 'need', 55, 'Gas', 7),
    makeTxn(transId, 'need', 30, 'Parking', 9),
  ]);
  transport.id = transId;
  transport.transactions.forEach(t => { t.categoryId = transId; });

  const diningId = uuidv4();
  const dining = makeCategory('Dining Out', 'want', '🍽️', '#f97316', 250, [
    makeTxn(diningId, 'want', 65, 'Birthday dinner', 2),
    makeTxn(diningId, 'want', 45, 'Lunch with coworkers', 5),
    makeTxn(diningId, 'want', 35, 'Saturday brunch', 7),
    makeTxn(diningId, 'want', 35, 'Pizza night', 9),
  ]);
  dining.id = diningId;
  dining.transactions.forEach(t => { t.categoryId = diningId; });

  const streamId = uuidv4();
  const streaming = makeCategory('Streaming', 'want', '🎬', '#a855f7', 50, [
    makeTxn(streamId, 'want', 16, 'Netflix', 3),
    makeTxn(streamId, 'want', 15, 'Spotify', 3),
    makeTxn(streamId, 'want', 16, 'Disney+', 3),
  ]);
  streaming.id = streamId;
  streaming.transactions.forEach(t => { t.categoryId = streamId; });

  const gymId = uuidv4();
  const gym = makeCategory('Gym', 'want', '💪', '#06b6d4', 60, [
    makeTxn(gymId, 'want', 60, 'Monthly membership', 1),
  ]);
  gym.id = gymId;
  gym.transactions.forEach(t => { t.categoryId = gymId; });

  const shopId = uuidv4();
  const shopping = makeCategory('Shopping', 'want', '👗', '#ec4899', 200, [
    makeTxn(shopId, 'want', 89, 'New jeans', 3),
    makeTxn(shopId, 'want', 55, 'Amazon order', 5),
    makeTxn(shopId, 'want', 45, 'Home goods', 7),
    makeTxn(shopId, 'want', 31, 'Shoes', 9),
  ]);
  shopping.id = shopId;
  shopping.transactions.forEach(t => { t.categoryId = shopId; });

  const emergId = uuidv4();
  const emergency = makeCategory('Emergency Fund', 'save', '🏦', '#22c55e', 600, [
    makeTxn(emergId, 'save', 600, 'Monthly emergency fund transfer', 1),
  ]);
  emergency.id = emergId;
  emergency.transactions.forEach(t => { t.categoryId = emergId; });

  const investId = uuidv4();
  const investments = makeCategory('Investments', 'save', '💰', '#3b82f6', 600, [
    makeTxn(investId, 'save', 300, 'Index fund contribution', 2),
    makeTxn(investId, 'save', 150, '401k contribution', 4),
    makeTxn(investId, 'save', 50, 'Roth IRA', 6),
  ]);
  investments.id = investId;
  investments.transactions.forEach(t => { t.categoryId = investId; });

  return [
    rent, utilities, groceries, health, transport,
    dining, streaming, gym, shopping,
    emergency, investments,
  ];
}

export const ICON_OPTIONS = [
  '🏠', '💡', '🛒', '🏥', '🚗', '🍽️', '🎬', '💪', '👗', '🏦',
  '💰', '📚', '✈️', '🎮', '🐾', '☕', '🧴', '💊', '🎓', '🏋️',
  '🎸', '🍕', '🌴', '💻',
];

export const COLOR_OPTIONS = [
  '#3b82f6', '#a855f7', '#22c55e', '#ef4444', '#f59e0b',
  '#f97316', '#ec4899', '#06b6d4', '#84cc16', '#6366f1',
];
