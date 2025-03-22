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

  ngAfterViewInit(){
    if (isPlatformBrowser(this.platformId)) {
      this.canvas = document.querySelector('canvas')!;
      this.ctx = this.canvas.getContext('2d')!;

      const container = document.querySelector('.content') as HTMLElement;

      this.canvas.width = container.offsetWidth;
      this.canvas.height = container.offsetHeight;

      this.drawWalls();
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
