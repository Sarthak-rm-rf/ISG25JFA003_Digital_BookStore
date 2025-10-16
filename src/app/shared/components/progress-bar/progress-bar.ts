import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css'
})
export class ProgressBar {
  // This input will determine the current active step.
  // It can be 'registration', 'cart', 'payment', or 'tracking'.
  @Input() currentStep: string = 'cart';

  private stepsOrder = ['registration', 'cart', 'payment', 'confirmed'];

  // Checks if a step should be marked as completed (i.e., it comes before the current step)
  isCompleted(stepName: string): boolean {
    const currentStepIndex = this.stepsOrder.indexOf(this.currentStep);
    const stepIndex = this.stepsOrder.indexOf(stepName);
    return stepIndex < currentStepIndex;
  }

  // Checks if a step is the currently active one
  isActive(stepName: string): boolean {
    return stepName === this.currentStep;
  }
}
