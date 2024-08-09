// Declara��es de vari�veis e constantes
const int ledPin = 13; // O pino do LED embutido na placa Arduino

void setup() {
  // Co o pino do LED como sa�da
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
