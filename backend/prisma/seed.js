require("dotenv").config();
const bcrypt = require("bcrypt");
const { PrismaClient, ElectionStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@evm.com";
  const adminPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "System Admin",
      email: adminEmail,
      password: adminPassword,
    },
  });

  const voters = [
    { name: "Aarav Sharma", email: "aarav@evm.com", voterId: "VTR1001", age: 28 },
    { name: "Isha Verma", email: "isha@evm.com", voterId: "VTR1002", age: 35 },
    { name: "Rohan Patel", email: "rohan@evm.com", voterId: "VTR1003", age: 42 },
  ];

  for (const voter of voters) {
    const hashedPassword = await bcrypt.hash("Voter@123", 10);
    await prisma.voter.upsert({
      where: { email: voter.email },
      update: {},
      create: {
        ...voter,
        password: hashedPassword,
      },
    });
  }

  const candidates = [
    {
      name: "Ananya Rao",
      party: "Progressive Front",
      symbolImage: "/symbols/pf.svg",
      description: "Focused on education and healthcare reform",
    },
    {
      name: "Karan Mehta",
      party: "National Alliance",
      symbolImage: "/symbols/na.svg",
      description: "Focused on infrastructure and employment growth",
    },
  ];

  for (const candidate of candidates) {
    const exists = await prisma.candidate.findFirst({ where: { name: candidate.name, party: candidate.party } });
    if (exists) {
      await prisma.candidate.update({
        where: { id: exists.id },
        data: {
          symbolImage: candidate.symbolImage,
          description: candidate.description,
        },
      });
      continue;
    }

    await prisma.candidate.create({ data: candidate });
  }

  const now = new Date();
  const startDate = new Date(now.getTime() + 60 * 60 * 1000);
  const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const existingElection = await prisma.election.findFirst({
    where: { electionName: "General Election 2026" },
  });

  if (!existingElection) {
    await prisma.election.create({
      data: {
        electionName: "General Election 2026",
        startDate,
        endDate,
        status: ElectionStatus.UPCOMING,
      },
    });
  }

  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
