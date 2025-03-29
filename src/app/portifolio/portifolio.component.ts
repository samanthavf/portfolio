import { CommonModule, isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, Inject, PLATFORM_ID } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-portifolio',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './portifolio.component.html',
  styleUrl: './portifolio.component.css'
})
export class PortifolioComponent implements AfterViewInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;


  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  modalAberto = false;
  projetoAtual = { titulo: '', imagem: '' , descricao: '',link: '' };

  projetos = [
    { titulo: 'Ciphernest', imagem: 'cipher-1.png', descricao: 'Descrição do projeto 1',link: 'https://ciphernest.netlify.app/encoder' },
    { titulo: 'Cardápio', imagem: 'projeto1.png', descricao: 'Descrição do projeto 2', link: ''  },
    { titulo: 'Space Chat', imagem: 'projeto1.png', descricao: 'Descrição do projeto 3', link: ''  },
    { titulo: 'meme-maker', imagem: 'mm-1.png', descricao: 'Descrição do projeto 4', link: 'https://samanthavf.github.io/meme-maker/'  },
    { titulo: 'Medieval Philosophy', imagem: 'fm-1.png', descricao: 'Descrição do projeto 5', link: 'https://samanthavf.github.io/Medieval-Philosophy/'  },
    { titulo: 'spreadssheets', imagem: 'sheet-1.png', descricao: 'Descrição do projeto 6', link: 'https://spreadssheets.netlify.app/spreadsheet'  },
    { titulo: 'borboletacilhuda', imagem: 'bbc-1.png', descricao: 'Descrição do projeto 7', link: 'https://borboletacilhuda.com/'  }
  ];

  abrirModal(projetoIndex: number) {
    this.projetoAtual = this.projetos[projetoIndex];
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  private walls = [
    [0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 0],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 2, 1, 0, 1, 2, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 2, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 2, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]

  ];

  private character = { img: null as HTMLImageElement | null, x: 1, y: 0, size: 50 };
  private carrot = { img: null as HTMLImageElement | null }
  private score = 0;

  updateScore() {
    let count = 0;
    for (let row = 0; row < this.walls.length; row++) {
      for (let col = 0; col < this.walls[row].length; col++) {
        if (this.walls[row][col] === 10 && count < this.score) {
          this.walls[row][col] = 4;
          count++;
          this.score--;
        }
      }
    }
    console.log('Score atualizado:', this.score);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.canvas = document.querySelector('canvas')!;
      this.ctx = this.canvas.getContext('2d')!;

      const container = document.querySelector('.content') as HTMLElement;

      this.canvas.width = container.offsetWidth;
      this.canvas.height = container.offsetHeight;
      

      this.character.img = new Image();
      this.character.img.src = 'char.gif';
      this.character.img.onload = () => {
        console.log('Imagem carregada');
        this.draw();
      };

      this.carrot.img = new Image();
      this.carrot.img.src = 'cenoura.png'
      this.carrot.img.onload = () => {
        console.log('Card Imagem carregada!');
        this.draw();
      }

      this.canvas.addEventListener('click', (event) => this.handleMouseMove(event));
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawWalls();
    this.drawCharacter();
  }


  handleMouseMove(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const cellSize = 80;
    const cellX = Math.floor(clickX / cellSize);
    const cellY = Math.floor(clickY / cellSize);

    if (this.walls[cellY] && this.walls[cellY][cellX] === 0) {
      this.character.x = cellX;
      this.character.y = cellY;
      this.draw();
      this.checkCollision(this.character.x * cellSize, this.character.y * cellSize);
    } else if (this.walls[cellY] && this.walls[cellY][cellX] === 2 ) {
      console.log('Visualizou um projeto!');
      this.walls[cellY][cellX] = 0


      const projetoIndex = this.getUniqueProjectIndex();
      this.abrirModal(projetoIndex);


      this.score++;
      this.updateScore();

      this.draw()
    }
  }

projetosExibidos: Set<number> = new Set();

getUniqueProjectIndex(){
  let projetoIndex;

  do {
    projetoIndex = Math.floor(Math.random() * this.projetos.length)
  } while (this.projetosExibidos.has(projetoIndex));

  this.projetosExibidos.add(projetoIndex);

if (this.projetosExibidos.size === this.projetos.length) {
  this.projetosExibidos.clear();
}
return projetoIndex;
}

  drawCharacter() {
    if (this.character.img && this.character.img.complete) {
      const cellSize = 80;
      this.ctx.drawImage(
        this.character.img,
        this.character.x * cellSize,
        this.character.y * cellSize,
        cellSize,
        cellSize
      );
    }
  }

  drawWalls() {
    const cellSize = 80;
   
    for (let row = 0; row < this.walls.length; row++) {
      for (let col = 0; col < this.walls[row].length; col++) {
        if (this.walls[row][col] === 1)  {
          this.ctx.fillStyle='white';
          this.ctx.fillRect(
            col*cellSize,
            row*cellSize,
            cellSize,
            cellSize
          );
        } else if (this.walls[row][col] === 2 && this.carrot.img) {
          this.ctx.drawImage(
            this.carrot.img,
            col * cellSize + (cellSize / 4),
            row * cellSize + (cellSize / 4),
            cellSize / 2,
            cellSize / 2
          );
        } else if (this.walls[row][col] === 10) {
          this.ctx.fillStyle = 'rgba(17, 17, 17, 0.7)';
          this.ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        } else if (this.walls[row][col] === 4 && this.carrot.img) {
          this.ctx.drawImage(
            this.carrot.img,
            col * cellSize + (cellSize / 4),
            row * cellSize + (cellSize / 4),
            cellSize / 2,
            cellSize / 2
          );
        }
      }
    }
  }

  checkCollision(x: number, y: number) {
    const row = Math.floor(y / 50);
    const col = Math.floor(x / 50);

    if (this.walls[row][col] === 2) {
      console.log('Visualizou projeto!')
      this.walls[row][col] = 0;

      const projetoIndex = Math.floor(Math.random() * this.projetos.length);
      this.abrirModal(projetoIndex);

      this.draw();
    }
  }
}