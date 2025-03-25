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
  templateUrl:'./portifolio.component.html',
  styleUrl: './portifolio.component.css'
})
export class PortifolioComponent implements AfterViewInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;


    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    modalAberto = false;
    projetoAtual = { titulo: '', descricao: '', imagem: '' };

    projetos = [
        { titulo: 'Projeto 1', descricao: 'Descrição do projeto 1', imagem: 'projeto1.png' },
        { titulo: 'Projeto 2', descricao: 'Descrição do projeto 2', imagem: 'projeto2.png' }
      ];

abrirModal(projetoIndex: number) {
  this.projetoAtual = this.projetos[projetoIndex];
  this.modalAberto = true;
}

fecharModal() {
  this.modalAberto = false;
}

  private walls =[
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,0,0,0,1,0,0,2,1,0,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,2,1,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,1,1,1,0,1],
    [1,0,0,0,2,1,0,1,2,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,0,1,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,2,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,0,1,0,1,2,1,0,1],
    [1,0,0,0,0,0,0,1,2,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  private character = {img: null as HTMLImageElement | null, x:0,y:0,size:50};
  private card = {img: null as HTMLImageElement | null}

  ngAfterViewInit(){
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

      this.card.img = new Image();
      this.card.img.src = 'cenoura.png'
      this.card.img.onload = () => {
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
  
    if (this.walls[cellY] && this.walls[cellY][cellX] === 0 ) {
      this.character.x = cellX;
      this.character.y = cellY;
      this.draw();
  }else if (this.walls[cellY] && this.walls[cellY][cellX] === 2) {
    console.log('Visualizou um projeto!');
    this.walls[cellY][cellX] = 0

    const projetoIndex = Math.floor(Math.random() * this.projetos.length);
    this.abrirModal(projetoIndex);

    this.draw()
  }
}

  drawCharacter() {
    if (this.character.img && this.character.img.complete) {
      const cellSize = 80;
      this.ctx.drawImage(
        this.character.img,
        this.character.x*cellSize,
        this.character.y*cellSize,
        cellSize,
        cellSize
      ); 
    }
  }

  drawWalls(){
    const cellSize = 80; 

    for(let row=0; row < this.walls.length; row++){
      for(let col=0; col < this.walls[row].length; col++){
        if(this.walls[row][col] === 1 ){
          this.ctx.fillStyle = 'white';
          this.ctx.fillRect(col*cellSize,row *cellSize,cellSize,cellSize);
        }else if (this.walls[row][col] === 2 && this.card.img) {
          this.ctx.drawImage(
            this.card.img,
            col * cellSize + (cellSize / 4),  // Ajuste para centralizar
            row * cellSize + (cellSize / 4),
            cellSize / 2, // Reduz o tamanho do card para melhor visualização
            cellSize / 2
          );
        }
      }
    }
  }

checkCollision(x: number, y: number){
  const row = Math.floor(y/50);
  const col = Math.floor(x/50);

  if (this.walls[row][col] === 2) {
    console.log('Visualizou projeto!')
    this.walls[row][col] = 0;

    const projetoIndex = Math.floor(Math.random() * this.projetos.length);
    this.abrirModal(projetoIndex);

    this.draw();
  }
}
}