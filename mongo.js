const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Provide a password as an argument");
  process.exit(1);
} else {
  const password = process.argv[2];
  const url = `mongodb+srv://inkyforuse:${password}@cluster0.7sftobi.mongodb.net/phonebook?retryWrites=true&w=majority`;

  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected");

      const personSchema = new mongoose.Schema({
        name: { type: String, required: true, minlength: 3 },
        number: { type: Number, required: true, minlength: 8 },
      });

      const Person = mongoose.model("Person", personSchema);

      if (process.argv.length === 3) {
        return Person.find({}).then((persons) => {
          console.log("Phonebook:");
          persons.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
          });
        });
      } else if (process.argv.length === 5) {
        const person = new Person({
          name: process.argv[3],
          number: process.argv[4],
        });
        return person.save().then((result) => {
          console.log(`Added ${result.name} number ${result.number} to phonebook`);
          mongoose.connection.close();
        });
      }
    })
    .then(() => {
      console.log("Disconnected");
      return mongoose.disconnect();
    });
}
