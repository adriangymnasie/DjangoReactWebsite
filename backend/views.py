from django.shortcuts import render

def home_page(request):
    # Här kan du hämta saker från databasen senare
    context = {
        'message': 'Kopplingen till databasen myapp fungerar!'
    }
    # Här säger vi till Django att använda din HTML-fil
    return render(request, 'index.html', context)