// Declarações de variáveis e constantes
const int ledPin = 13; // O pino do LED embutido na placa Arduino

void setup() {
  // Co o pino do LED como saída
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Acende o LED
  digitalWrite(ledPin, HIGH);
  delay(10); // Aguarda 1 segundo

  // Apaga o LED
  digitalWrite(ledPin, LOW);
  delay(10); // Aguarda 1 segundo
}
