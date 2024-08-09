unsigned long previousMillis = 0; // Armazena o tempo da �ltima mensagem
const long interval = 500; // Intervalo de 500 milissegundos (meio segundo)

void setup() {
  Serial.begin(9600); // Inicia a comunica��o serial a 9600 bps
}

void loop() {
  unsigned long currentMillis = millis(); // Obt�m o tempo atual

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis; // Atualiza o tempo da �ltima mensagem
    
    if (Serial.available() > 0) {
      char receivedChar = Serial.read(); // L� o caractere recebido
      
      if (receivedChar == 'A') {
        Serial.println("Ah, claro, voc� digitou 'A'. O que mais voc� tem de surpreendente para me mostrar?");
      }
    }
  }
}
