extensions="
aaron-bond.better-comments
akamud.vscode-caniuse
akamud.vscode-javascript-snippet-pack
christian-kohler.npm-intellisense
dbaeumer.vscode-eslint
eamodio.gitlens
eg2.tslint
eg2.vscode-npm-script
esbenp.prettier-vscode
fabiospampinato.vscode-projects-plus
joelday.docthis
joshjg.generate-react-component
kkozee.vscode-react-templates
MS-CEINTL.vscode-language-pack-zh-hans
OfHumanBondage.react-proptypes-intellisense
robertohuertasm.vscode-icons
wayou.vscode-todo-highlight
wix.vscode-import-cost
xabikos.JavaScriptSnippets
xabikos.ReactSnippets
"

for extension in ${extensions};
do 
code --install-extension ${extension}
done