const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
} else if (process.argv.length > 5) {
  console.log(`mongo.js script should only be used with a maximum of 5 args`);
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://nchulefthing:${password}@cluster0.uylgeyy.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

/**
 * create phonebookEntry schema
 */
const phonebookEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

/**
 * use note schema to create model(<singular name of the model>, <schema>)
 */
const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema);

if (process.argv.length === 3) {
  // Display all phonebook entries
  PhonebookEntry.find({}).then((result) => {
    result.forEach((phonebookEntry) => {
      console.log(phonebookEntry);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // Create a phonebook entry
  const name = process.argv[3];
  const number = process.argv[4];

  // use model to create a new saveable note object
  const phonebookEntry = new PhonebookEntry({
    name: name,
    number: number,
  });

  // persist the object in the database, and close connection
  phonebookEntry.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
