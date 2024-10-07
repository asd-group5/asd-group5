from django.shortcuts import render
from .models import MenuItem

def menu_list(request):
    query = request.GET.get('q')  # Get the search query from the URL
    if query:
        # Filter menu items based on the search query
        menu_items = MenuItem.objects.filter(name__icontains=query)
    else:
        # If no search query, show all items
        menu_items = MenuItem.objects.all()
    
    return render(request, 'menu/menu_list.html', {'menu_items': menu_items})
