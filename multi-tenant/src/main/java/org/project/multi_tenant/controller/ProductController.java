package org.project.multi_tenant.controller;

import org.project.multi_tenant.entity.Product;
import org.project.multi_tenant.service.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", allowedHeaders = "*")


public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{tenantId}")
    public List<Product> getProductsByTenant(@PathVariable String tenantId) {
        return productService.getProductsByTenant(tenantId);
    }

    @PostMapping("/{tenantId}")
    public Product createProduct(@PathVariable String tenantId, @RequestBody Product product) {
        return productService.saveProduct(tenantId, product);
    }
    @GetMapping("/health")
    public String healthCheck() {
        return "UP";
    }

}
