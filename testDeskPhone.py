import time
import threading
import requests
import datetime
import socket

TOKEN = "" # inserisci il token del tuo bot telegram
CHAT_ID = "" # inserisci il chat id del tuo bot telegram

notificato = False

def pingTest():
            try:
                socket.create_connection(("8.8.8.8", 53), timeout=3)
                return True
            except OSError:
                return False


def controlla_rete():
    global notificato
    while True:
        connessione_attiva = pingTest()
        if not connessione_attiva:
            if not notificato:
                print("ATTENZIONE, CONNESSIONE PERSA")
                notificato = True
                oraBlackOut = datetime.datetime.now()
                oraBlackOutTelegram = oraBlackOut.strftime('%H:%M')
                url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
                payload = {
                    "chat_id": CHAT_ID,
                    "text": f"ATTENZIONE, Rilevamento perdita connessione alle {oraBlackOutTelegram}"
                }
                try:
                    requests.get(url, params=payload, timeout=5)
                except Exception as e:
                    print (f"C'è stato un problema: {e}")
        else:
            if notificato:
                notificato = False
                oraRipristino = datetime.datetime.now()
                oraRipristinoTelegram = oraRipristino.strftime('%H:%M')
                print(f"Connessione ripristinata alle {oraRipristinoTelegram}")
                url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
                payload = {
                    "chat_id": CHAT_ID,
                    "text": f"Connessione persa alle {oraBlackOutTelegram} e ripristinata alle {oraRipristinoTelegram}"
                }
                try:
                    requests.get(url, params=payload, timeout=5)
                except Exception as e:
                    print (f"C'è stato un problema: {e}")
        time.sleep(10)

def mostra_orologio():
     while True:
        oraCorrente = datetime.datetime.now()
        oraDaTrasm = oraCorrente.strftime('%H:%M')
        print(oraDaTrasm)
        time.sleep(1)

if __name__ == "__main__":
    thread_rete = threading.Thread(target=controlla_rete)
    thread_rete.start()
    mostra_orologio()