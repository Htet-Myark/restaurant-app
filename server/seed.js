const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.menuItem.createMany({
    data: [
      { name: "Margherita Pizza", description: "Classic cheese pizza", price: 9.99 },
      { name: "Spaghetti Bolognese", description: "Meaty tomato pasta", price: 12.5 },
      { name: "Caesar Salad", description: "Fresh lettuce and croutons", price: 7.5 },
      { name: "Chicken Wings", description: "Spicy and crispy", price: 8.99 },
      { name: "Iced Lemon Tea", description: "Refreshing drink", price: 3.5 },
    ]
  });
  console.log("✅ Sample menu items added.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
