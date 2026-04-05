import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico - Teste Básico', () => {

test.beforeEach(async ({ page }) => {
  await page.goto('https://senagustavo.github.io/02-TesteAutomatizado-Gustavo-eDiego/');
});

// ========== GRUPO 1: Cadastro de Alunos ==========
  test.describe('Cadastro de Alunos', () => {

    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const linhas = page.locator('#tabela-alunos tbody tr');
      const linhaJoao = linhas.filter({ hasText: 'João Silva' });

      await expect(linhas).toHaveCount(1);
      await expect(linhaJoao).toHaveCount(1);
    });

    test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Ana Costa');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('cadastrado com sucesso');
    });

    test('não deve cadastrar aluno sem nome', async ({ page }) => {
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

    // Teste adicional 1
    test('deve rejeitar notas fora do intervalo 0-10', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Teste Nota Inválida');
      await page.getByLabel('Nota 1').fill('11');   // inválida
      await page.getByLabel('Nota 2').fill('5');
      await page.getByLabel('Nota 3').fill('-1');   // inválida

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Deve mostrar mensagem de erro ou não cadastrar
      await expect(page.locator('#mensagem')).toContainText('inválida', { timeout: 10000 });
      // ou verificar que não apareceu na tabela
      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(0);
    });

  });

  // ========== GRUPO 2: Cálculo de Média ==========
  test.describe('Cálculo de Média', () => {

    test('deve calcular a média aritmética das três notas', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Pedro Santos');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const celulaMedia = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(4);
      await expect(celulaMedia).toHaveText('8.00');
    });

  });

  // ========== GRUPO 3: Busca ==========
  test.describe('Busca por Nome', () => {

    test('deve filtrar alunos corretamente pela busca', async ({ page }) => {
      // Cadastrar dois alunos
      await page.getByLabel('Nome do Aluno').fill('Maria Oliveira');
      await page.getByLabel('Nota 1').fill('8'); await page.getByLabel('Nota 2').fill('9'); await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Carlos Mendes');
      await page.getByLabel('Nota 1').fill('4'); await page.getByLabel('Nota 2').fill('5'); await page.getByLabel('Nota 3').fill('6');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Buscar por "Maria"
      await page.getByPlaceholder('Buscar por nome').or(page.getByLabel('Buscar')).fill('Maria');
      await page.keyboard.press('Enter'); // ou clique no botão de busca se existir

      const linhasVisiveis = page.locator('#tabela-alunos tbody tr');
      await expect(linhasVisiveis).toHaveCount(1);
      await expect(linhasVisiveis).toContainText('Maria Oliveira');
    });

  });

  // ========== GRUPO 4: Exclusão ==========
  test.describe('Exclusão de Alunos', () => {

    test('deve excluir um aluno corretamente', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Para Excluir');
      await page.getByLabel('Nota 1').fill('5'); await page.getByLabel('Nota 2').fill('6'); await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Clicar no botão de excluir da linha (ajuste o locator conforme seu HTML)
      await page.locator('#tabela-alunos tbody tr').filter({ hasText: 'Aluno Para Excluir' })
        .getByRole('button', { name: 'Excluir' }).click();

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(0);
    });

  });

  // ========== GRUPO 5: Estatísticas ==========
  test.describe('Estatísticas', () => {

    test('deve atualizar os cards de estatísticas corretamente', async ({ page }) => {
      // Aprovado
      await page.getByLabel('Nome do Aluno').fill('Aprovado 1');
      await page.getByLabel('Nota 1').fill('8'); await page.getByLabel('Nota 2').fill('9'); await page.getByLabel('Nota 3').fill('10');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Recuperação
      await page.getByLabel('Nome do Aluno').fill('Recuperacao 1');
      await page.getByLabel('Nota 1').fill('5'); await page.getByLabel('Nota 2').fill('6'); await page.getByLabel('Nota 3').fill('5');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Reprovado
      await page.getByLabel('Nome do Aluno').fill('Reprovado 1');
      await page.getByLabel('Nota 1').fill('3'); await page.getByLabel('Nota 2').fill('4'); await page.getByLabel('Nota 3').fill('2');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#stat-aprovados')).toContainText('1');
      await expect(page.locator('#stat-recuperacao')).toContainText('1');
      await expect(page.locator('#stat-reprovados')).toContainText('1');
    });

  });

  // ========== GRUPO 6: Situação do Aluno ==========
  test.describe('Situação do Aluno', () => {

    test('deve classificar como Aprovado quando média >= 7', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Aprovado');
      await page.getByLabel('Nota 1').fill('8'); await page.getByLabel('Nota 2').fill('9'); await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const linha = page.locator('#tabela-alunos tbody tr').filter({ hasText: 'Aluno Aprovado' });
      await expect(linha.locator('.badge')).toHaveText('Aprovado');
    });

    test('deve classificar como Reprovado quando média < 5', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Reprovado');
      await page.getByLabel('Nota 1').fill('2'); await page.getByLabel('Nota 2').fill('3'); await page.getByLabel('Nota 3').fill('4');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const linha = page.locator('#tabela-alunos tbody tr').filter({ hasText: 'Aluno Reprovado' });
      await expect(linha.locator('.badge')).toHaveText('Reprovado');
    });

    test('deve classificar como Recuperação quando 5 <= média < 7', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Recuperacao');
      await page.getByLabel('Nota 1').fill('6'); await page.getByLabel('Nota 2').fill('5'); await page.getByLabel('Nota 3').fill('5');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const linha = page.locator('#tabela-alunos tbody tr').filter({ hasText: 'Aluno Recuperacao' });
      await expect(linha.locator('.badge')).toHaveText('Recuperação');
    });

  });

  // ========== GRUPO 7: Múltiplos Cadastros ==========
  test.describe('Múltiplos Cadastros', () => {

    test('deve permitir cadastrar múltiplos alunos', async ({ page }) => {
      const alunos = [
        { nome: 'Aluno 1', n1: '9', n2: '8', n3: '7' },
        { nome: 'Aluno 2', n1: '6', n2: '5', n3: '4' },
        { nome: 'Aluno 3', n1: '10', n2: '9', n3: '8' }
      ];

      for (const aluno of alunos) {
        await page.getByLabel('Nome do Aluno').fill(aluno.nome);
        await page.getByLabel('Nota 1').fill(aluno.n1);
        await page.getByLabel('Nota 2').fill(aluno.n2);
        await page.getByLabel('Nota 3').fill(aluno.n3);
        await page.getByRole('button', { name: 'Cadastrar' }).click();
      }

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);
    });

  });
});