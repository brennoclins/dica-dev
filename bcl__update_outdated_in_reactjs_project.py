import os
import subprocess

# Verifica se o arquivo package.json existe
if not os.path.isfile("package.json"):
    print("Arquivo package.json não encontrado. Certifique-se de estar no diretório do projeto.")
    exit(1)

# Verifica se o diretório node_modules existe
if not os.path.isdir("node_modules"):
    print("Diretório node_modules não encontrado. Instalando as dependências...")
    subprocess.run(["npm", "install"])

print("Verificando dependências desatualizadas")
subprocess.run(["npm", "outdated"])

print("Atualizando as dependências")
subprocess.run(["npm", "update"])

print("Verificando se houve atualizações")
outdated = subprocess.run(["npm", "outdated", "--json"], capture_output=True, text=True)
updated = subprocess.run(["npm", "outdated"], capture_output=True, text=True)

# Se houver atualizações, realiza o commit
if outdated.stdout != updated.stdout:
    print("Realizando commit das atualizações")
    subprocess.run(["git", "add", "package.json", "package-lock.json"])
    subprocess.run(["git", "commit", "-m", "update: Updating dependencies [Atualização de dependências]"])

print("Dependências atualizadas:")
print(updated.stdout)
