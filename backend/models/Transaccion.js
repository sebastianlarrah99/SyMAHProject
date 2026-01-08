const mongoose = require("mongoose");

const transaccionBaseOptions = {
  discriminatorKey: "tipo",
  collection: "transacciones",
};

const transaccionSchema = new mongoose.Schema(
  {
    monto: {
      type: Number,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.Mixed, // Permitir tanto ObjectId como String
      required: function () {
        return this.actorTipo !== "Gasto" || this.actorTipo === "Gasto";
      },
      validate: {
        validator: function (value) {
          if (this.actorTipo === "Gasto") {
            const tiposDeGasto = [
              "Material",
              "Arreglo",
              "Impuesto",
              "Seguro",
              "Herramienta",
              "Combustible",
              "Otro",
            ];
            return tiposDeGasto.includes(value);
          } else {
            return mongoose.Types.ObjectId.isValid(value);
          }
        },
        message: (props) =>
          props.path === "Gasto"
            ? `${props.value} no es un tipo de gasto válido.`
            : `${props.value} no es un ObjectId válido.`,
      },
    },
    actorTipo: {
      type: String,
      required: true,
      enum: ["Empleado", "Trabajo", "Gasto"],
    },
    descripcion: {
      type: String,
      required: false,
    },
  },
  transaccionBaseOptions
);

const gastoSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
});

transaccionSchema.pre("save", function (next) {
  if (!this.actor) {
    this.actorTipo = "Gasto";
  }
  next();
});

module.exports = {
  Transaccion: mongoose.model("Transaccion", transaccionSchema),
  Gasto: mongoose.model("Gasto", gastoSchema),
};
