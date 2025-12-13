#!/bin/bash

# Definir directorio base dentro de 'web'
BASE_DIR="src"

# Crear directorios del CORE (Dominio, Casos de Uso, Repositorios)
mkdir -p "$BASE_DIR/core/domain/entities"
touch "$BASE_DIR/core/domain/entities/.gitkeep"

mkdir -p "$BASE_DIR/core/domain/errors"
touch "$BASE_DIR/core/domain/errors/.gitkeep"

mkdir -p "$BASE_DIR/core/use-cases"
touch "$BASE_DIR/core/use-cases/.gitkeep"

mkdir -p "$BASE_DIR/core/repositories"
touch "$BASE_DIR/core/repositories/.gitkeep"

# Crear directorios de INFRAESTRUCTURA
mkdir -p "$BASE_DIR/infrastructure/services"
touch "$BASE_DIR/infrastructure/services/.gitkeep"

mkdir -p "$BASE_DIR/infrastructure/api"
touch "$BASE_DIR/infrastructure/api/.gitkeep"

# Crear directorios de PRESENTACIÓN (UI)
mkdir -p "$BASE_DIR/presentation/components/ui"
touch "$BASE_DIR/presentation/components/ui/.gitkeep"

mkdir -p "$BASE_DIR/presentation/components/features"
touch "$BASE_DIR/presentation/components/features/.gitkeep"

mkdir -p "$BASE_DIR/presentation/hooks"
touch "$BASE_DIR/presentation/hooks/.gitkeep"

mkdir -p "$BASE_DIR/presentation/context"
touch "$BASE_DIR/presentation/context/.gitkeep"

echo "✅ Estructura de directorios Clean Architecture creada exitosamente en $BASE_DIR/"