import pyautogui
import sys

messages = list(map(str, sys.argv[1:]))


def sendMessage(text):
    pyautogui.write(text)
    pyautogui.press("enter")


if __name__ == "__main__":
    for text in messages:
        sendMessage(text)
