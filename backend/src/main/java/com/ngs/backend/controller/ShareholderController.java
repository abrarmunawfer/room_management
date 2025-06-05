package com.ngs.backend.controller;

import com.ngs.backend.entity.Shareholder;
import com.ngs.backend.service.ShareholderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shareholders")
public class ShareholderController {
    @Autowired
    private ShareholderService service;

    @GetMapping
    public List<Shareholder> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Shareholder create(@RequestBody Shareholder shareholder) {
        return service.save(shareholder);
    }

    @PutMapping("/{id}")
    public Shareholder update(@PathVariable Long id, @RequestBody Shareholder shareholder) {
        return service.update(id, shareholder);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
