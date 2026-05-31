const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding diverse sample data...');

  // Create Treatments
  await prisma.treatment.createMany({
    data: [
      { Treatment_Name: 'Teeth Whitening', Base_Price: 12000.00 },
      { Treatment_Name: 'Dental Crown', Base_Price: 35000.00 },
      { Treatment_Name: 'Braces Adjustment', Base_Price: 5000.00 },
      { Treatment_Name: 'Wisdom Tooth Removal', Base_Price: 20000.00 },
      { Treatment_Name: 'Dental Implant', Base_Price: 150000.00 },
      { Treatment_Name: 'Fluoride Treatment', Base_Price: 3000.00 }
    ]
  });

  // Create Persons and Patients
  const patient1 = await prisma.person.create({
    data: { First_Name: 'Kasun', Last_Name: 'Bandara', NIC: '198512345679', Contact_Number: '0711234567', Address: 'Kandy Road, Peradeniya', Person_Type: 'Patient' }
  });
  await prisma.patient.create({ data: { Patient_ID: patient1.Person_ID, Date_of_Birth: new Date('1985-05-15'), Blood_Group: 'B+', Allergies: 'None' } });

  const patient2 = await prisma.person.create({
    data: { First_Name: 'Nimali', Last_Name: 'Perera', NIC: '199298765431', Contact_Number: '0779876543', Address: 'Main Street, Galle', Person_Type: 'Patient' }
  });
  await prisma.patient.create({ data: { Patient_ID: patient2.Person_ID, Date_of_Birth: new Date('1992-10-20'), Blood_Group: 'O-', Allergies: 'Dust' } });
  
  const patient3 = await prisma.person.create({
    data: { First_Name: 'Ruwan', Last_Name: 'Silva', NIC: '197055566677', Contact_Number: '0722334455', Address: 'Galle Road, Colombo 03', Person_Type: 'Patient' }
  });
  await prisma.patient.create({ data: { Patient_ID: patient3.Person_ID, Date_of_Birth: new Date('1970-01-10'), Blood_Group: 'A+', Allergies: 'Latex' } });

  // Create Persons and Dentists
  const dentist1 = await prisma.person.create({
    data: { First_Name: 'Samantha', Last_Name: 'Fernando', NIC: '197511223345', Contact_Number: '0751122335', Address: 'Havelock Town, Colombo 05', Person_Type: 'Dentist' }
  });
  await prisma.dentist.create({ data: { Dentist_ID: dentist1.Person_ID, SLMC_Reg_No: 'SLMC-12345', Specialization: 'General Dentist' } });

  const dentist2 = await prisma.person.create({
    data: { First_Name: 'Ayesha', Last_Name: 'Jayasinghe', NIC: '198211223346', Contact_Number: '0721122336', Address: 'Malabe, Colombo', Person_Type: 'Dentist' }
  });
  await prisma.dentist.create({ data: { Dentist_ID: dentist2.Person_ID, SLMC_Reg_No: 'SLMC-54321', Specialization: 'Oral Surgeon' } });
  
  const dentist3 = await prisma.person.create({
    data: { First_Name: 'Dilshan', Last_Name: 'Rathnayake', NIC: '198811122233', Contact_Number: '0719988776', Address: 'Nugegoda, Colombo', Person_Type: 'Dentist' }
  });
  await prisma.dentist.create({ data: { Dentist_ID: dentist3.Person_ID, SLMC_Reg_No: 'SLMC-99887', Specialization: 'Pediatric Dentist' } });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
