void setup() {
  Serial.begin(9600); // Inicia a comunica��o serial a 9600 bps
}

void loop() {
  if (Serial.available() > 0) {
    char receivedChar = Serial.read(); // L� o caractere recebido
    
    if (receivedChar == 'A') {
      Serial.println("Ah, claro, voc� digitou 'A'. O que mais voc� tem de surpreendente para me mostrar?");
    }
  }
}
