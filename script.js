

class Aluno {
  constructor(registro, nome, notas) {
    this.registro = registro; // Armazena o número de registro do aluno
    this.nome = nome;         // Armazena o nome do aluno
    this.notas = notas;       // Armazena as notas do aluno (array)
    this.media = 0;           // Inicializa a média do aluno com 0
    this.situacao = '';       // Inicializa a situação (Aprovado/Reprovado) como string vazia
  }
}


document.getElementById('configForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário (recarregar a página)


  const totalAlunos = parseInt(this.numeroAlunos.value); // Pega o número de alunos digitado
  const totalAvaliacoes = parseInt(this.numeroAvaliacoes.value); // Pega o número de avaliações digitado

  const materiasFixas = ['Matemática', 'Português', 'Ciências', 'Geografia', 'História', 'Inglês', 'Música', 'Química'];
  const nomesMaterias = materiasFixas.slice(0, totalAvaliacoes);

  const container = document.getElementById('fieldsContainer'); // Referência ao container onde os campos serão criados

  container.innerHTML = ''; // Limpa o conteúdo do container (caso já tenha algo)


  for (let i = 0; i < totalAlunos; i++) { // Loop para criar campos de entrada para cada aluno
    
    const section = document.createElement('div'); // Cria uma nova seção (div) para o aluno

    section.innerHTML = `
            <h4>Aluno ${i + 1}</h4>
            <label>Registro: <input name="registro_${i}" required /></label>
            <label>Nome: <input name="nome_${i}" required /></label>`; // Adiciona inputs de registro e nome do aluno   

    for (let j = 0; j < totalAvaliacoes; j++) { // Loop para criar os campos de nota para o aluno
      section.innerHTML += `<label>${nomesMaterias[j]}: <input name="nota_${i}_${j}" type="number" step="0.01" required /></label>`;
    }

      container.appendChild(section); // Adiciona a seção com os campos ao container
  }


  this.style.display = 'none'; // Esconde o formulário de configuração
  document.getElementById('studentsForm').style.display = 'block'; // Mostra o formulário de alunos
});


document.getElementById('studentsForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário


  const formData = new FormData(this); // Pega todos os dados do formulário
  const numeroAlunos = document.querySelectorAll('[name^="registro_"]').length; // Conta quantos alunos foram inseridos

  const numeroAvaliacoes = document.querySelectorAll('[name^="nota_0_"]').length; // Conta quantas avaliações por aluno
  
  //Lista fixa com os nomes das matérias em ordem
  const materiasFixas = ['Matemática', 'Português', 'Ciências', 'Geografia', 'História', 'Inglês', 'Música', 'Química'];
  const nomesMaterias = materiasFixas.slice(0, numeroAvaliacoes);


  const notasMatriz = []; // Matriz para armazenar todas as notas
  const listaAlunos = []; // Lista de objetos Aluno



  for (let i = 0; i < numeroAlunos; i++) { // Loop pelos alunos
    const notasDoAluno = []; // Lista de notas do aluno atual


    for (let j = 0; j < numeroAvaliacoes; j++) { // Loop pelas avaliações
      const valorNota = parseFloat(formData.get(`nota_${i}_${j}`)) || 0.0; // Pega a nota do input e transforma em número
      notasDoAluno.push(valorNota); // Adiciona a nota à lista do aluno
    }

    notasMatriz.push(notasDoAluno); // Adiciona as notas à matriz geral
    const registro = formData.get(`registro_${i}`); // Pega o registro do aluno
    const nome = formData.get(`nome_${i}`); // Pega o nome do aluno
    listaAlunos.push(new Aluno(registro, nome, notasDoAluno)); // Cria um novo objeto Aluno e adiciona na lista
  }


  const somaPorAvaliacao = Array(numeroAvaliacoes).fill(0); // Cria array com zeros para somar as notas de cada avaliação
  for (const notas of notasMatriz) { // Para cada aluno
    notas.forEach((nota, idx) => {
      somaPorAvaliacao[idx] += nota; // Soma as notas por avaliação (por índice)
    });
  }


  const mediaPorAvaliacao = somaPorAvaliacao.map(soma => soma / numeroAlunos); // Calcula a média por avaliação


  let totalAprovados = 0;
  let totalReprovados = 0;
  let melhorAluno = null;
  let piorAluno = null;


  for (const aluno of listaAlunos) {
    const media = aluno.notas.reduce((a, b) => a + b, 0) / numeroAvaliacoes; // Calcula média do aluno
    aluno.media = media; // Armazena a média no objeto
    aluno.situacao = media >= 6.0 ? 'Aprovado' : 'Reprovado'; // Define situação com base na média  


    if (aluno.situacao === 'Aprovado') totalAprovados++; // Conta aprovados
    else totalReprovados++; // Conta reprovados


    if (!melhorAluno || aluno.media > melhorAluno.media) melhorAluno = aluno; // Atualiza melhor aluno
    if (!piorAluno || aluno.media < piorAluno.media) piorAluno = aluno; // Atualiza pior aluno
  }

 this.style.display = 'none';
  // Mostrar os resultados
  const resultados = document.getElementById('resultados'); //pegar a referência da <div> com o id resultados no HTML
  //definir o conteúdo HTML dentro da div resultados
  resultados.innerHTML = `  
        <h2>Resultados</h2>
        <h3>Médias por Avaliação</h3>
        <table>
         <tr>${nomesMaterias.map(m => `<th>${m}</th>`).join('')}</tr>
          <tr>${mediaPorAvaliacao.map(m => `<td>${m.toFixed(2)}</td>`).join('')}</tr>
        </table>
        
        <h3>Lista de Alunos</h3>
        <table>
          <tr><th>Registro</th><th>Nome</th><th>Média</th><th>Situação</th></tr>
          ${listaAlunos.map(aluno => `
            <tr>
              <td>${aluno.registro}</td>
              <td>${aluno.nome}</td>
              <td>${aluno.media.toFixed(2)}</td>
              <td>${aluno.situacao}</td>
            </tr>
          `).join('')}
        </table>

        <h3>Estatistica</h3>
        <table>
            <tr><th>Total Aprovados:</th><th>Total Reprovados:</th><th>Melhor Aluno:</th><th>Pior Aluno:</th></tr>
            <td>${totalAprovados}</td>
            <td>${totalReprovados}</td>
            <td>${melhorAluno.nome} (${melhorAluno.media.toFixed(2)})</td>
            <td>${piorAluno.nome} (${piorAluno.media.toFixed(2)})</td>
        </table>
        <p><a href="">&#8592; Nova simulação</a></p>
      `;
});
  