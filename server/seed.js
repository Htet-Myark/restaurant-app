const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const menuItems = [
    { name: "Pizza", description: "Cheese pizza", price: 9.99 },
    { name: "Burger", description: "Beef burger", price: 8.5 },
    { name: "Lemonade", description: "Fresh lemon drink", price: 3.0 },
    { name: "Fries", description: "Crispy fries", price: 4.0 }, // NEW item
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { name: item.name }, // must be unique
      update: {}, // do nothing if it exists
      create: item
    });
  }

  console.log("✅ Seeded (only new items were added).");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
