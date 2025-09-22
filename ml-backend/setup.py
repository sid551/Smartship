from setuptools import setup, find_packages

setup(
    name="smartship-ml-api",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "Flask==2.2.2",
        "Flask-CORS==3.0.10",
        "numpy==1.21.6",
        "scikit-learn==1.0.2",
        "gunicorn==20.1.0"
    ],
    python_requires=">=3.9,<3.10"
)