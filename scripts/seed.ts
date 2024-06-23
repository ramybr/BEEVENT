const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.eventType.createMany({
      data: [
        { name: "Workshop" },
        { name: "Training" },
        { name: "Team Building" },
        { name: "Conference" },
        { name: "Seminar" },
        { name: "Symposium" },
        { name: "Other" },
      ],
    });
    console.log("sucess");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
  try {
    await database.activitySector.createMany({
      data: [
        { name: "Technology" },
        { name: "Energy" },
        { name: "Finance" },
        { name: "Health Care" },
        { name: "Telecommunications" },
        { name: "Motor Vehicule" },
        { name: "Food/Beverage" },
        { name: "Transportations" },
        { name: "Engineering/Construction" },
        { name: "Media" },
        { name: "Other" },
      ],
    });
    console.log("sucess");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
