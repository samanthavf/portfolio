import { isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, Inject, PLATFORM_ID } from "@angular/core";

@Component({
  selector: 'app-portifolio',
  standalone: true,
  imports: [],
  templateUrl:'./portifolio.component.html',
  styleUrl: './portifolio.component.css'
})
export class PortifolioComponent implements AfterViewInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;


    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private walls =[
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,1,0,0,0,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,0,1,0,0,0,1],
    [1,0,1,1,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,1,0,1,1,1,0,1,0,0,0,1,0,1,0,1],
    [1,1,0,0,0,0,0,1,0,1,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  private character = {img: null as HTMLImageElement | null, x:0,y:0,size:50};

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
        if(this.walls[row][col] === 1){
          this.ctx.fillStyle = 'white';
          this.ctx.fillRect(col*cellSize,row *cellSize,cellSize,cellSize);
        }
      }
    }
  }
}
