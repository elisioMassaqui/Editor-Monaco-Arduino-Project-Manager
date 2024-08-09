// Declarações de variáveis e constantes
const int ledPin = 13; // O pino do LED embutido na placa Arduino
const int led2 = 2;
const int led3 = 7;
void setup() {
  // Configura o pino do LED como saída
  pinMode(ledPin, OUTPUT);
   pinMode(led2, OUTPUT);
   pinMode(led3, OUTPUT);
}

void loop() {
  // Acende o LED
  digitalWrite(ledPin, HIGH);
  digitalWrite(led2, HIGH);
  digitalWrite(led3, HIGH);
  delay(300); // Aguarda 1 segundo

  // Apaga o LED
  digitalWrite(ledPin, LOW);
  digitalWrite(led2, LOW);
  digitalWrite(led3, LOW);
  delay(500); // Aguarda 1 segundo
}