import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';  // Standalone component
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule

// Bootstrap the application with the HttpClientModule provider
bootstrapApplication(AppComponent, {
  providers: [
    HttpClientModule  // Provide HttpClientModule for the standalone app
  ]
});
