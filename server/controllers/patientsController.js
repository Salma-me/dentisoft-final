const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const getPatient = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'patient ID required.' });

    const patient = await prisma.patient.findOne({ _id: req.params.id }).exec();
    if (!patient) {
        return res.status(204).json({ "message": `No patient matches ID ${req.params.id}.` });
    }
    res.json(patient);
}
const registerNewPatient = async (req, res) => {
    // res.json({ message: 'Patient registered successfully.' });
    const {SSN, address, contact, dateOfBirth, email, firstName, gender, lastName, password} = req.body
    
    try {
        // Check if email already exists
        const existingEmail = await prisma.patient.findUnique({ where: { email: email } })
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists.' })
        }

        // Check if SSN already exists
        const existingSSN = await prisma.patient.findUnique({ where: { PatientSSN: SSN } })
        if (existingSSN) {
            return res.status(400).json({ message: 'SSN already exists.' })
        }

        // Validate password strength (minimum length)
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' })
        }

        // res.json({ message: 'Patient registered successfully.' });
        res.json(req.body)
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma client
    }}

const createNewPatientRegistered = async (req, res) => {
    // res.json(req.body) 
    const {data, firstFormData} = req.body
    // const firstFormData = JSON.parse(sessionStorage.getItem('firstFormData'))
    // const { alcoholStatus, allergies, allergyStatus, bloodGroup, chronicDiseaseStatus, chronicDiseases, smokingStatus } = req.body
    // console.log(req.body)
    console.log(firstFormData)
    console.log(data)
    // const { SSN, address, contact, dateOfBirth, email, firstName, gender, lastName, password } = req.body.firstFormData;
    const{chronicDiseaseStatus, chronicDiseases, alcoholStatus, smokingStatus,allergyStatus, allergies, bloodGroup} = data
    const {SSN, address, contact, dateOfBirth, email, firstName, gender, lastName, password} = firstFormData
    try {
        const smokingStatusBool = smokingStatus==="No"?false:true
        const alcoholStatusBool = alcoholStatus==="No"?false:true
        const allergyStatusBool = allergyStatus==="No"?false:true
        const chronicDiseaseStatusBool = chronicDiseaseStatus==="No"?false:true
        const result = await prisma.patient.create({
            data: {
                PatientSSN: SSN,
                fName: firstName,
                lName: lastName,        
                birthDate: (new Date(dateOfBirth)).toISOString() ,     
                age: getAge(dateOfBirth),
                gender: gender,            
                address: address,
                phone: contact,             
                email: email,
                Smoker: smokingStatusBool,
                alcoholIntake: alcoholStatusBool,
                bloodGroup: bloodGroup,
            }
        })
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.profileLogin.create({
          data: {
            username: email,
            password: hashedPassword,
            userType: 'patient',
            patientId: result.patientID,
            }
        })
        if (allergyStatusBool){
        await prisma.allergies.create({
          data: {
            allergySource: allergies,
            patientId: result.patientID
            }
        })}
        if (chronicDiseaseStatusBool){
        await prisma.chronicDisease.create({
          data: {
            disease: chronicDiseases,
            patientId: result.patientID
            }
        })}

        res.json(true)
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma client
    }
}

const updatePatient = async (req, res) => {
  // console.log(req.body)
  // console.log(req.params)
  const {userName, firstName, lastName, email, address, contact, currentPassword, newPassword } = req.body
  const patientId = parseInt(req.params.patientId)
  try {
    const foundUser = await prisma.profileLogin.findFirst({ where: {username: userName }})
    const match = await bcrypt.compare(currentPassword, foundUser.password)
    if (!match){return res.sendStatus(401)} // current password is incorrect
    
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const updatedProfile = await prisma.profileLogin.update({where: {patientId: patientId},
       data:
         {
          username: userName,
          password: hashedPassword
         }
        })
    const updatedUser = await prisma.patient.update({where: {patientID: patientId},
       data:
        {
          fName: firstName,
          lName: lastName,
          email: email,
          address: address,
          phone: contact
        }})

    res.json(updatedUser)
} catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
} finally {
    await prisma.$disconnect(); // Disconnect Prisma client
}
}

const getPatientProfile = async (req, res) => {
  const patient = req.query.user
  const patientId = parseInt(patient.patientID)
  try {
    const foundProfile = await prisma.profileLogin.findFirst({ where: {patientId: patientId }})
    res.json(foundProfile.username)
} catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
} finally {
    await prisma.$disconnect(); // Disconnect Prisma client
}
}
// -----------------------------------------Appointment---------------------------------------
const bookAppointment = async (req, res) => {
    // TODO: Available days and hours checks
    const {data, appointmentTime} = req.body
    // console.log(req.body)
    // console.log(appointmentTime)
    const {address, contact, dateOfAppointment, dateOfBirth, doctor, email, firstName, gender, lastName, visitReason} = data
    const [fName, lName] = doctor.split(" ")
    const patient = await prisma.patient.findUnique({ where: { email: email } })
    const dentist = await prisma.dentist.findFirst({where: {fName: fName , lName: lName}})
    // console.log(`patient is ${patient.patientID}`)
    const service = await getServiceByName(visitReason)
    try {
        const result = await prisma.visit.create({
            data: {
                date: (new Date(dateOfAppointment)).toISOString(),
                time: appointmentTime,
                status: "Scheduled",        
                // reason: visitReason ,     
                patientId: patient.patientID,
                dentistSsn: dentist.DentistSSN,
                serviceId: service.ServiceId
                // service: {ServiceName: visitReason, ServiceCost: cost, ServiceId: 1}
            }
        })
        const bill = await prisma.invoice.create({
          data: {
            Date: new Date().toISOString(),
            TotalCost: service.ServiceCost,
            // paidById: patient.patientID,
            // DentistSsn: dentist.DentistSSN,
            Status: "Unpaid",
            visitId: result.id
            }
        })

        // await prisma.servicesProvided.create({
        //     data: {
        //         ServiceName: visitReason,
        //         ServiceCost: parseFloat(cost),
        //         ServiceId: bill.BillingId
        //     }})

        res.json(true)
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma client
    }
}
async function getServiceByName(serviceName) {
  try {
    const service = await prisma.servicesProvided.findFirst({
      where: {
        ServiceName: serviceName,
      },
      select: {
        ServiceId: true,
        ServiceCost: true
      },
    });

    if (!service) {
      throw new Error(`Service with name ${serviceName} not found`);
    }

    return service;
  } catch (error) {
    console.error("Error fetching service ID:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
const bookAppointmentDentistsOptions = async (req, res) => {
  // console.log(req.body)
  // res.json("true")
  const dentistsArrays = await getDentistsArrays()
  const { dentistsNames, dentistsImages, dentistsWorkingHours } = dentistsArrays;
  res.json(dentistsArrays)
    try {
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma client
    }
    // res.json(req.body)
}
async function getDentistsArrays() {
  const dentists = await prisma.dentist.findMany({
    select: {
      fName: true,
      lName: true,
      personalImageURL: true,
      workingHours: {
        select: {
          shift: true
        }
      }
    }
  });

  const dentistsNames = dentists.map(dentist => `${dentist.fName} ${dentist.lName}`);
  const dentistsImages = dentists.map(dentist => dentist.personalImageURL);
  const dentistsWorkingHours = dentists.map(dentist => dentist.workingHours.map(wh => wh.shift).join(", "));

  // console.log("Dentists Names: ", dentistsNames);
  // console.log("Dentists Images: ", dentistsImages);
  // console.log("Dentists Working Hours: ", dentistsWorkingHours);
  return {dentistsNames, dentistsWorkingHours, dentistsImages}
}

// const getAppointments = async (req, res) => { 
//     console.log(req.body)
//     try {
//         const upcomingAppointments = await prisma.visit.findMany({where: {status: "Scheduled"}, include: {Sets: true}})
//         const cancelledAppointments = await prisma.visit.findMany({where: {status: "Cancelled"}, include: {Sets: true}})
//         const completedAppointments = await prisma.visit.findMany({where: {status: "Completed"}, include: {Sets: true}})
//         const appointments = {upcomingAppointments, cancelledAppointments, completedAppointments}
//         const scheduledAppointmentsDetails = upcomingAppointments.map((visit) => {
//             const { id, date, time, reason, Sets: dentist } = visit;
//             const doctorName = `Dr. ${dentist.fName} ${dentist.lName}`;
//             const appointmentDate = date.toISOString().split("T")[0];
//             const startTime = time.split("-")[0]; // Extract start time
//             const appointmentTime = startTime.replace(/^0+/, ''); // Remove leading zeros
//             const doctorEmail = dentist.email;
//             const conditionReason = reason;
//             return {
//                 id,
//                 doctorName,
//                 appointmentDate,
//                 appointmentTime,
//                 doctorEmail,
//                 conditionReason,
//               };
//             });
//             console.log(scheduledAppointmentsDetails)
//         res.json(scheduledAppointmentsDetails)
//     } catch (error) {
//         console.error('Error registering patient:', error);
//         res.status(500).json({ message: 'An error occurred while processing your request.' });
//     } finally {
//         await prisma.$disconnect(); // Disconnect Prisma client
//     }
// }

// async function getRequiredAppointmentsAttributes(appointmentsList){
//     const appointmentsDetails = appointmentsList.map((visit) => {
//         const { id, date, time, reason, Sets: dentist } = visit;
//         const doctorName = `Dr. ${dentist.fName} ${dentist.lName}`;
//         const appointmentDate = date.toISOString().split("T")[0];
//         const startTime = time.split("-")[0]; // Extract start time
//         const appointmentTime = startTime.replace(/^0+/, ''); // Remove leading zeros
//         const doctorEmail = dentist.email;
//         const conditionReason = reason;
//         return {
//             id,
//             doctorName,
//             appointmentDate,
//             appointmentTime,
//             doctorEmail,
//             conditionReason,
//           };
//         });
//     return appointmentsDetails
// }
const cancelAppointment = async (req, res) => {
    const appointmentId = parseInt(req.params.id)
    try {
      res.json(true)
      deleteInvoice = await prisma.invoice.delete({where: {visitId : appointmentId}})
      const cancelledAppointment = await prisma.visit.update({
        where: {id: appointmentId},
        data: {
            status:"Cancelled",
        },
      })
  } catch (error) {
      console.error('Error Cancelling appointment:', error);
      res.status(500).json({ message: 'An error occurred while processing your request.' });
  } finally {
      await prisma.$disconnect(); // Disconnect Prisma client
  }
}
const deleteAppointment = async (req, res) => {
    const appointmentId = parseInt(req.params.id)
    try {
      deleteVisit = await prisma.visit.delete({where: {id : appointmentId}})
      res.json(true)
  } catch (error) {
      console.error('Error Deleting appointment:', error)
      res.status(500).json({ message: 'An error occurred while processing your request.' })
  } finally {
      await prisma.$disconnect(); // Disconnect Prisma client
  }
}
const getAppointments = async (req, res) => { 
    // console.log(req.body)
    const patient = JSON.parse(req.query.patient)
    const {patientID} = patient
    try {
        const upcomingAppointments = await prisma.visit.findMany({where: {status: "Scheduled", patientId:patientID}, include: {Sets: true}})
        const cancelledAppointments = await prisma.visit.findMany({where: {status: "Cancelled", patientId:patientID}, include: {Sets: true}})
        const completedAppointments = await prisma.visit.findMany({where: {status: "Completed", patientId:patientID}, include: {Sets: true}})
        const scheduledAppointmentsDetails = await getRequiredAppointmentsAttributes(upcomingAppointments)
        const cancelledAppointmentsDetails = await getRequiredAppointmentsAttributes(cancelledAppointments)
        const completedAppointmentsDetails = await getRequiredAppointmentsAttributes(completedAppointments)
        const allAppointments = {scheduledAppointmentsDetails, cancelledAppointmentsDetails, completedAppointmentsDetails}
        // console.log(allAppointments)
        // console.log(scheduledAppointmentsDetails)
        res.json(allAppointments)
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma client
    }
}
async function getRequiredAppointmentsAttributes(appointmentsList) {
  const appointmentsDetails = [];
  
  if (appointmentsList.length > 0) {
      for (const visit of appointmentsList) {
          const { id, date, time, Sets: dentist, serviceId } = visit;
          const doctorName = `Dr. ${dentist.fName} ${dentist.lName}`;
          const appointmentDate = date.toISOString().split("T")[0];
          const startTime = time.split("-")[0]; // Extract start time
          const appointmentTime = startTime.replace(/^0+/, ''); // Remove leading zeros
          const doctorEmail = dentist.email;
          const service = await prisma.servicesProvided.findFirst({
              where: { ServiceId: serviceId }
          }, { select: { serviceName: true } });
          const conditionReason = service.ServiceName
          
          appointmentsDetails.push({
              id,
              doctorName,
              appointmentDate,
              appointmentTime,
              doctorEmail,
              conditionReason,
          });
      }
  }
  
  return appointmentsDetails;
}

const editAppointments = async (req, res) => { 
  console.log(req.body)
  const {values, appointmentTime, visitID} = req.body
  // console.log(req.body)
  // console.log(appointmentTime)
  const {doctor, Service, dateOfAppointment} = values
  const [fName, lName] = doctor.split(" ")
  const dentist = await prisma.dentist.findFirst({where: {fName: fName , lName: lName}})
  const service = await getServiceByName(Service)
  try {
    const result = await prisma.visit.update({
        where: {id: visitID},
      data: {
        date: (new Date(dateOfAppointment)).toISOString(),
        time: appointmentTime,
        dentistSsn: dentist.DentistSSN,
        serviceId: service.ServiceId
      },
    })

    const previousInvoice = await prisma.invoice.findFirst({
      where: {
        visitId: result.id, // Assuming visitId is the ID of the updated visit
      },
    });
    
    if (previousInvoice) {
      // 2. Update the fields of the previous invoice
      const updatedInvoice = await prisma.invoice.update({
        where: {
          BillingId: previousInvoice.BillingId, // Use the ID of the previous invoice
        },
        data: {
          // Update the fields of the invoice as needed
          Date: new Date().toISOString(),
          TotalCost: service.ServiceCost,
        },})
        console.log("invoice updated")
    } 
    res.json(true)
  } catch (error) {
      console.error('Error registering patient:', error);
      res.status(500).json({ message: 'An error occurred while processing your request.' });
  } finally {
      await prisma.$disconnect(); // Disconnect Prisma client
  }
}

// -----------------------------------------Medical Records---------------------------------------

const getMedicalRecords = async (req, res) => { 
  const patient = JSON.parse(req.query.patient)
  // console.log(patient)
    // res.json(req.params.patient)
    try {
        // res.json(allAppointments)
        const medicalRecords = await getPatientMedicalRecords(patient.patientID)
        res.json(medicalRecords)
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma client
    }
}
async function getPatientMedicalRecords(patientId) {
  try {
    // Fetch the patient's medical records with the specified attributes
    const medicalRecords = await prisma.diagnosis.findMany({
      where: {
        patientId: patientId
      },
      select: {
        DiagnosisID: true,
        AffectedArea: true,
        diagnosis: true,
        diagnosedDate: true,
        visit: {select: {
          serviceId: true
        }},
        treatments: {
          select: {
            TreatmentType: true,
            Medications: {
              select: {
                name: true,
              }
            }
          }
        },
        Diagnose: {
          select: {
            fName: true,
            lName: true,
          }
        },
        procedures: {
          select: {name: true}
        }
      },
    });
    // console.log(`medical records ${medicalRecords}`)
    // medicalRecords.forEach(record => {
    //   console.log(`Diagnosis ID: ${record.DiagnosisID}`);
    //   console.log(`Diagnosis: ${record.diagnosis}`);
    //   console.log(`Affected Area: ${record.AffectedArea}`);
    //   console.log(`Diagnosed Date: ${record.diagnosedDate}`);
    //   // console.log(`treatment Date: ${record.diagnosedDate}`);
    //   console.log(`Diagnosed by: ${record.Diagnose.fName} ${record.Diagnose.lName}`);
    //   // console.log(`service by: ${record.visit}`);
      
    //   record.visit.forEach(visit => {
    //     console.log(`Service ID: ${visit.serviceId}`)});
    //   })

    // Transform the fetched data to match the required attributes
    const transformedRecords = medicalRecords.map(record => ({
      ID: record.DiagnosisID,
      // Title: "Prescription" + " " +record.DiagnosisID,
      CreatedBy: `Dr. ${record.Diagnose.fName} ${record.Diagnose.lName}`,
      Date: record.diagnosedDate.toJSON().split("T")[0],
      DiseaseOrCondition: record.diagnosis,
      AffectedArea: record.AffectedArea,
      treatment: record.treatments.map(treatment => treatment.TreatmentType),
      surgeries: record.procedures.map(proc=>proc.name),
      // visitReason: record.visit.serviceId === 1?"Examination":record.visit.serviceId === 2?"Consultation":"Surgery",
      visitReason: record.visit.map(visit=>visit.serviceId=== 1?"Examination":visit.serviceId === 2?"Consultation":"Surgery"),
      Medications: record.treatments.flatMap(treatment => treatment.Medications.map(med => ({
        name: med.name,
        // dosage: med.dosage,
        // DosageUnit: med.DosageUnit,
        // frequency: med.frequency,
      }))).map(med=>med.name),
    }));
    // transformedRecords.forEach(record => {
    //   console.log(`Diagnosis ID: ${record.ID}`);
    //   console.log(`Diagnosis: ${record.DiseaseOrCondition}`);
    //   console.log(`Affected Area: ${record.AffectedArea}`);
    //   console.log(`Diagnosed Date: ${record.Date}`);
    //   console.log(`Diagnosed by: ${record.CreatedBy}`);
    //   console.log(`visit reason: ${record.visitReason}`);
    //   console.log(`surgery: ${record.surgeries}`);
    //   console.log(`medications: ${record.Medications}`);
    //   console.log(`treatments: ${record.treatment}`);
    //   })

    return transformedRecords;
  } catch (error) {
    console.error('Error fetching patient medical records:', error);
    throw error;
  }
}

// -----------------------------------------Perscriptions---------------------------------------
const getPrescriptions = async (req, res) => { 
    const patient = JSON.parse(req.query.patient)
    const {patientID} = patient
    try {
        const prescriptions = await getPrescriptionsForPatient(patientID)
        // res.json(prescriptions)
        console.log(prescriptions)
        res.json(prescriptions)
    } catch (error) {
        console.error('Error getting patient prescriptions:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma client
    }
}

async function getPrescriptionsForPatient(patientId) {
  try {
    // Fetch diagnosis records for the patient
    const diagnosisRecords = await prisma.diagnosis.findMany({
      where: {
        patientId: patientId,
      },
      select: {
        DiagnosisID: true,
        diagnosis: true,
        DentistSsn: true,
        diagnosedDate: true,
      },
    });

    // Fetch associated treatments for the diagnoses to get medications
    const treatments = await prisma.treatment.findMany({
      where: {
        patientId: patientId,
      },
      include: {
        Medications: true,
      },
    });

    const diagnosisWithMedications = [];
    for (const diagnosis of diagnosisRecords) {

      const treatment = treatments.find(treatment => treatment.diagnosisId === diagnosis.DiagnosisID);

      const medications = treatment ? treatment.Medications : [];
      const dentist = await prisma.dentist.findUnique({
        where: {
          DentistSSN: diagnosis.DentistSsn,
        },
        select: {
          fName: true,
          lName: true,
        },
      });
      let dentistName = ''
      
      if (dentist) {
        dentistName = `${dentist.fName} ${dentist.lName}`
    }
        const diagnosisObject = {
            id: diagnosis.DiagnosisID,
        title: "Prescription " + diagnosis.DiagnosisID,
        doctorName: "Dr." + dentistName,
        date: diagnosis.diagnosedDate,
        disease: diagnosis.diagnosis,
        drugs: medications.map(medication => medication.name)
      }
      diagnosisWithMedications.push(diagnosisObject);
    };

    return diagnosisWithMedications;
  } catch (error) {
    console.error('Error fetching diagnosis and medications:', error);
    throw error;
  }
}

// -----------------------------------------Invoices---------------------------------------
const getInvoices = async (req, res) => { 
    const patient = JSON.parse(req.query.patient)
    const {patientID} = patient
    try {
        const invoices = await getInvoicesForPatient(patientID)
        // console.log(invoices)
        
        res.json(invoices)
    } catch (error) {
        console.error('Error getting patient prescriptions:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma client
    }
}
async function getInvoicesForPatient(patientId) {
    try {
      // Fetch invoice records for the specified patient
      const invoices = await prisma.invoice.findMany({
        where: {
          visit: {
            patientId: patientId
          }
        },
        select: {
          BillingId: true,
          TotalCost: true,
          Date: true,
          Status: true,
          // Navigate through the relationships to get doctor name and insurance coverage
          visit: {
            select: {
              Sets: {
                select: {
                  fName: true,
                  lName: true
                }
              },
              Reserve: {
                select: {
                  InsuranceCoverage: true
                }
              }
            }
          }
        }
      });
    //   id: number;
    // doctorName: string;
    // cost: number;
    // date: string;
    // discount: number;
    // total: number;
    // invoiceID: string;
    // status: string;
      // Map the retrieved data into the required format
      const invoiceDetails = invoices.map(invoice => ({
        id: invoice.BillingId,
        doctorName: `${invoice.visit.Sets.fName} ${invoice.visit.Sets.lName}`,
        cost: invoice.TotalCost,
        date: (invoice.Date),
        discount: invoice.visit.Reserve.InsuranceCoverage,
        total: invoice.visit.Reserve.InsuranceCoverage==='None'?invoice.TotalCost:invoice.TotalCost * ((100.0 - parseFloat(invoice.visit.Reserve.InsuranceCoverage.split("%")[0])) / 100.0),
        invoiceID: formatInvoiceId(invoice.BillingId),
        status: invoice.Status
      }));
  
      return invoiceDetails;
    } catch (error) {
      console.error('Error fetching invoices for patient:', error);
      throw error;
    }
  }

// ------------Helper functions---------
function formatInvoiceId(id) {
    const paddedId = String(id).padStart(3, '0'); // Ensure 3 digits with leading zeros
    return `INV-${paddedId}`;
  }

  const PDFDocument = require('pdfkit');
  const fs = require('fs');
  
  function generateInvoicePDF(invoiceData) {
    const doc = new PDFDocument();
    
    // Pipe the PDF into a writable stream
    doc.pipe(fs.createWriteStream('invoice.pdf'));
  
    // Add the invoice title
    doc.fontSize(25).text(`Invoice ${invoiceData.invoiceId}`, { align: 'center' });
  
    // Add some data
    doc.fontSize(12).text(`Date: ${invoiceData.date}`, { align: 'left' });
    doc.text(`Doctor Name: ${invoiceData.doctorName}`);
    doc.text(`Cost: $${invoiceData.cost}`);
    doc.text(`Insurance Coverage: ${invoiceData.insuranceCoverage}`);
    doc.text(`Total: $${invoiceData.total}`);
    doc.text(`Status: ${invoiceData.status}`);
  
    // Finalize the PDF and end the stream
    doc.end();
  }
  
  // Sample invoice data
  const invoiceData = {
    invoiceId: 'INV-001',
    date: '2024-05-16',
    doctorName: 'Dr. John Smith',
    cost: 100.0,
    insuranceCoverage: '55%',
    total: 45.0,
    status: 'Paid'
  };
  
  // generateInvoicePDF(invoiceData);
  
  

module.exports = {
registerNewPatient,
getPatient,
getPatientProfile,
getAppointments,
getMedicalRecords,
getPrescriptions,
getInvoices,
createNewPatientRegistered,
bookAppointment,
bookAppointmentDentistsOptions,
updatePatient,
editAppointments,
cancelAppointment,
deleteAppointment
}